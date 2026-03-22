import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { NotificationGatewayService } from '../notifications/notifications.gateway.service';

@Injectable()
export class PickupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationGatewayService,
  ) { }


  // USER: Schedule a pickup
  async create(requesterUserId: string, createPickupDto: CreatePickupDto, photoUrl?: string) {
    const { address, scheduledAt, items, estimatedCost, note } = createPickupDto;

    if (new Date(scheduledAt) <= new Date()) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    const materialIds = items.map((i) => i.materialId);
    const uniqueMaterialIds = new Set(materialIds);
    if (uniqueMaterialIds.size !== materialIds.length) {
      throw new BadRequestException('Duplicate materials are not allowed in a single pickup');
    }

    const materials = await this.prisma.material.findMany({
      where: { materialId: { in: materialIds } },
    });
    if (materials.length !== materialIds.length) {
      throw new BadRequestException('One or more materials are invalid');
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }
    }

    const pickupAddress = await this.prisma.address.upsert({
      where: {
        userId_line1_postalCode: {
          userId: requesterUserId,
          line1: address.line1,
          postalCode: address.postalCode,
        },
      },
      update: {
        line2: address.line2,
        city: address.city,
        province: address.province,
        latitude: address.latitude,
        longitude: address.longitude,
      },
      create: {
        userId: requesterUserId,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });

    const pickup = await this.prisma.pickup.create({
      data: {
        requesterUserId,
        scheduledAt: new Date(scheduledAt),
        addressId: pickupAddress.addressId,
        status: 'PENDING',
        photoUrl,
        estimatedCost,
        note,
        items: {
          create: items.map((item) => ({
            materialId: item.materialId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: { include: { material: true } },
        address: true,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { userId: requesterUserId },
      select: { email: true },
    });

    if (user) {
      await this.notificationService.notifyPickupScheduled({
        userId: requesterUserId,
        recipientEmail: user.email,
        pickupId: pickup.pickupId,
        scheduledDate: scheduledAt,
      });
    }

    return {
      message: 'Pickup scheduled successfully',
      pickup,
    };
  }

  // COLLECTOR: Get all PENDING pickup requests
  async getRequests() {
    return this.prisma.pickup.findMany({
      where: { status: 'PENDING' },
      include: {
        items: { include: { material: true } },
        address: true,
        requester: {
          select: {
            userId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }


  // USER: Get all their own pickups
  async findAll(requesterUserId: string) {
    return this.prisma.pickup.findMany({
      where: { requesterUserId },
      include: {
        items: { include: { material: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }


  // Get a single pickup by ID
  async findOne(pickupId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
      include: {
        items: { include: { material: true } },
        address: true,
        requester: {
          select: { userId: true, name: true, email: true },
        },
        collector: {
          select: { userId: true, name: true, email: true },
        },
      },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    return pickup;
  }


  // COLLECTOR: Accept a pickup
  async accept(pickupId: string, collectorUserId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
      include: { items: true },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.status !== 'PENDING') {
      throw new BadRequestException(
        pickup.status === 'ACCEPTED'
          ? 'This pickup has already been accepted by a collector'
          : pickup.status === 'COMPLETED'
            ? 'This pickup has already been completed'
            : pickup.status === 'CANCELLED'
              ? 'This pickup has been cancelled and cannot be accepted'
              : `Pickup is already ${pickup.status}`,
      );
    }

    const collectorProfile = await this.prisma.collectorProfile.findUnique({
      where: { userId: collectorUserId },
    });

    if (!collectorProfile) {
      throw new BadRequestException('Collector profile not found. Please complete your profile setup');
    }

    const materialIds = pickup.items.map((item) => item.materialId);
    const collectorPricings = await this.prisma.collectorPricing.findMany({
      where: {
        collectorUserId,
        materialId: { in: materialIds },
        status: 'ACTIVE',
      },
    });

    let estimatedEarning = 0;
    const snapshots = pickup.items.map((item) => {
      const pricing = collectorPricings.find(
        (p) => p.materialId === item.materialId,
      );

      const basePrice = pricing ? Number(pricing.basePrice) : 0;
      const bulkPrice = pricing?.bulkPrice ? Number(pricing.bulkPrice) : null;
      const bulkThreshold = collectorProfile?.bulkThreshold ?? null;

      const useBulk =
        collectorProfile?.bulkIncentiveEnabled &&
        bulkPrice !== null &&
        bulkThreshold !== null &&
        item.quantity >= bulkThreshold;

      const priceUsed = useBulk ? bulkPrice : basePrice;
      estimatedEarning += item.quantity * priceUsed;

      return {
        pickupId,
        materialId: item.materialId,
        quantity: item.quantity,
        basePrice,
        bulkPrice,
        bulkThreshold,
        priceUsed,
      };
    });

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.pickupSnapshot.createMany({
        data: snapshots,
      });

      return tx.pickup.update({
        where: { pickupId },
        data: {
          collectorUserId,
          status: 'ACCEPTED',
          estimatedEarning,
        },
        include: {
          items: { include: { material: true } },
          address: true,
          snapshots: true,
        },
      });
    });

    if (pickup.requesterUserId) {
      const requester = await this.prisma.user.findUnique({
        where: { userId: pickup.requesterUserId },
        select: { email: true },
      });

      if (requester) {
        await this.notificationService.notifyPickupStatusChanged({
          userId: pickup.requesterUserId,
          recipientEmail: requester.email,
          pickupId,
          status: 'ACCEPTED',
        });
      }
    }

    return {
      message: 'Pickup accepted successfully',
      pickup: updated,
    };
  }


  // COLLECTOR: Complete a pickup
  async complete(pickupId: string, collectorUserId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
      include: { items: true, snapshots: true },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.status !== 'ACCEPTED') {
      throw new BadRequestException(
        pickup.status === 'PENDING'
          ? 'This pickup must be accepted before it can be completed'
          : pickup.status === 'COMPLETED'
            ? 'This pickup has already been completed'
            : pickup.status === 'CANCELLED'
              ? 'This pickup has been cancelled and cannot be completed'
              : `Pickup cannot be completed from status ${pickup.status}`,
      );
    }

    // Only the collector who accepted can complete it
    if (pickup.collectorUserId !== collectorUserId) {
      throw new ForbiddenException('Only the assigned collector can complete this pickup');
    }

    // Calculate actual earning from snapshots
    const actualEarning = pickup.snapshots.reduce((total, snapshot) => {
      return total + snapshot.quantity * Number(snapshot.priceUsed);
    }, 0);

    // Complete pickup and credit customer wallet in a transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      // Update pickup status and actual earning
      const completedPickup = await tx.pickup.update({
        where: { pickupId },
        data: {
          status: 'COMPLETED',
          actualEarning,
        },
        include: {
          items: { include: { material: true } },
          address: true,
          snapshots: true,
        },
      });

      // Credit the customer's wallet
      if (pickup.requesterUserId && actualEarning > 0) {
        const wallet = await tx.wallet.findUnique({
          where: { userId: pickup.requesterUserId },
        });

        if (wallet) {
          await tx.wallet.update({
            where: { walletId: wallet.walletId },
            data: {
              balance: { increment: actualEarning },
            },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: wallet.walletId,
              userId: pickup.requesterUserId,
              type: 'CREDIT',
              amount: actualEarning,
              status: 'COMPLETED',
              description: `Pickup completed - ${pickup.items.length} item(s) collected`,
              referenceType: 'PICKUP',
              referenceId: pickupId,
            },
          });
        }
      }

      return completedPickup;
    });

    // Notify the customer
    if (pickup.requesterUserId) {
      const requester = await this.prisma.user.findUnique({
        where: { userId: pickup.requesterUserId },
        select: { email: true },
      });

      if (requester) {
        await this.notificationService.notifyPickupStatusChanged({
          userId: pickup.requesterUserId,
          recipientEmail: requester.email,
          pickupId,
          status: 'COMPLETED',
        });
      }
    }

    return {
      message: 'Pickup completed successfully',
      pickup: updated,
      actualEarning,
    };
  }


  // USER: Update a pickup (PENDING only, requester only)
  async update(pickupId: string, requesterUserId: string, updatePickupDto: UpdatePickupDto) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    // Only the requester can update
    if (pickup.requesterUserId !== requesterUserId) {
      throw new ForbiddenException('Only the pickup requester can update this pickup');
    }

    // Can only update PENDING pickups
    if (pickup.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot update a pickup with status ${pickup.status}. Only PENDING pickups can be updated.`,
      );
    }

    // Validate rescheduled date is in the future
    if (updatePickupDto.scheduledAt && new Date(updatePickupDto.scheduledAt) <= new Date()) {
      throw new BadRequestException('Rescheduled date must be in the future');
    }

    const updated = await this.prisma.pickup.update({
      where: { pickupId },
      data: {
        ...(updatePickupDto.scheduledAt && {
          scheduledAt: new Date(updatePickupDto.scheduledAt),
        }),
        ...(updatePickupDto.estimatedCost !== undefined && {
          estimatedCost: updatePickupDto.estimatedCost,
        }),
        ...(updatePickupDto.note !== undefined && {
          note: updatePickupDto.note,
        }),
      },
      include: {
        items: { include: { material: true } },
        address: true,
      },
    });

    return {
      message: 'Pickup updated successfully',
      pickup: updated,
    };
  }


  // USER: Cancel a pickup
  async cancel(pickupId: string, requesterUserId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    // Only the requester can cancel
    if (pickup.requesterUserId !== requesterUserId) {
      throw new ForbiddenException('Only the pickup requester can cancel this pickup');
    }

    if (pickup.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed pickup');
    }

    if (pickup.status === 'CANCELLED') {
      throw new BadRequestException('This pickup is already cancelled');
    }

    const cancelled = await this.prisma.pickup.update({
      where: { pickupId },
      data: { status: 'CANCELLED' },
      include: {
        items: { include: { material: true } },
        address: true,
      },
    });

    // Notify on cancellation
    if (pickup.requesterUserId) {
      const requester = await this.prisma.user.findUnique({
        where: { userId: pickup.requesterUserId },
        select: { email: true },
      });

      if (requester) {
        await this.notificationService.notifyPickupStatusChanged({
          userId: pickup.requesterUserId,
          recipientEmail: requester.email,
          pickupId,
          status: 'CANCELLED',
        });
      }
    }

    return {
      message: 'Pickup cancelled successfully',
      pickup: cancelled,
    };
  }
  async getAvailableSlots(month: number, year: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const takenPickups = await this.prisma.pickup.findMany({
      where: {
        scheduledAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'],
        },
      },
      select: {
        scheduledAt: true,
      },
    });

    const ALL_SLOTS = [
      { id: "slot-1", label: "9:00 AM - 11:00 AM", startHour: 9 },
      { id: "slot-2", label: "11:00 AM - 1:00 PM", startHour: 11 },
      { id: "slot-3", label: "1:00 PM - 3:00 PM", startHour: 13 },
      { id: "slot-4", label: "3:00 PM - 5:00 PM", startHour: 15 },
    ];

    const MAX_PER_SLOT = 3;

    const takenCount: Record<string, number> = {};
    for (const pickup of takenPickups) {
      const date = pickup.scheduledAt;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const h = date.getHours();
      const key = `${y}-${m}-${d}-${h}`;
      takenCount[key] = (takenCount[key] || 0) + 1;
    }

    const totalDays = new Date(year, month, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result: Record<string, { id: string; label: string }[]> = {};

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      if (date < today) continue;

      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const dateKey = `${y}-${m}-${d}`;

      const available = ALL_SLOTS.filter((slot) => {
        const key = `${dateKey}-${slot.startHour}`;
        return (takenCount[key] || 0) < MAX_PER_SLOT;
      }).map(({ id, label }) => ({ id, label }));

      if (available.length > 0) {
        result[dateKey] = available;
      }
    }

    return result;
  }
}