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
import { PickupQueryDto, PickupStatus } from './dto/pickup-query.dto';
import { paginate, getPaginationParams } from '../common/pagination/pagination-helper';

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
      this.notificationService.notifyPickupScheduled({
        userId: requesterUserId,
        recipientEmail: user.email,
        pickupId: pickup.pickupId,
        scheduledDate: scheduledAt,
      }).catch(() => {});
    }

    return {
      message: 'Pickup scheduled successfully',
      pickup,
    };
  }

  // COLLECTOR: Get all PENDING pickup requests
  async getRequests(query: PickupQueryDto) {
  const { page = 1, limit = 10, search, status, startDate, endDate } = query;
  const { skip, take } = getPaginationParams(page, limit);

  const where: any = { status: status ?? 'PENDING' };

  if (startDate || endDate) {
    where.scheduledAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    };
  }

  if (search) {
    where.OR = [
      { requester: { name: { contains: search, mode: 'insensitive' } } },
      { requester: { email: { contains: search, mode: 'insensitive' } } },
      { address: { line1: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [pickups, total] = await Promise.all([
    this.prisma.pickup.findMany({
      where,
      include: {
        items: { include: { material: true } },
        address: true,
        requester: {
          select: { userId: true, name: true, email: true, phoneNumber: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      skip,
      take,
    }),
    this.prisma.pickup.count({ where }),
  ]);

  return paginate(pickups, total, page, limit);
}


  // COLLECTOR: Request-level stats (pending, accepted, potential revenue)
  async getCollectorPickupStats(collectorId: string) {
    const [pending, accepted, acceptedRevenueAgg, collectorProfile] = await Promise.all([
      this.prisma.pickup.count({
        where: { status: PickupStatus.PENDING, collectorUserId: null, rejections: { none: { collectorId } } },
      }),
      this.prisma.pickup.count({
        where: { collectorUserId: collectorId, status: PickupStatus.ACCEPTED },
      }),
      // Only accepted pickups have a meaningful estimatedEarning for this collector
      this.prisma.pickup.aggregate({
        where: { collectorUserId: collectorId, status: PickupStatus.ACCEPTED },
        _sum: { estimatedEarning: true },
      }),
      this.prisma.collectorProfile.findUnique({
        where: { userId: collectorId },
        select: { serviceFee: true, feeType: true },
      }),
    ]);

    const grossAccepted = Number(acceptedRevenueAgg._sum.estimatedEarning ?? 0);
    const rawFee  = Number(collectorProfile?.serviceFee ?? 0);
    const feeType = collectorProfile?.feeType ?? 'PERCENTAGE';

    // Potential revenue = what the collector actually earns (their service fee cut)
    const potentialRevenue =
      feeType === 'PERCENTAGE'
        ? grossAccepted * (rawFee / 100)
        : accepted * rawFee; // flat fee × number of accepted pickups

    return {
      pendingRequests:  pending,
      acceptedRequests: accepted,
      potentialRevenue,
    };
  }

  // COLLECTOR: Get pickups scoped to the logged-in collector (with isCompatible)
  async getCollectorPickups(collectorId: string, query: PickupQueryDto) {
    const { page = 1, limit = 10, search, status, startDate, endDate } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const validStatus = status && Object.values(PickupStatus).includes(status as PickupStatus)
      ? (status as PickupStatus)
      : undefined;

    // PENDING = unassigned pickups this collector hasn't rejected
    // ACCEPTED/COMPLETED/CANCELLED = pickups assigned to this collector
    const where: any = validStatus === PickupStatus.PENDING
      ? { status: PickupStatus.PENDING, collectorUserId: null, rejections: { none: { collectorId } } }
      : { collectorUserId: collectorId, ...(validStatus ? { status: validStatus } : {}) };

    if (startDate || endDate) {
      where.scheduledAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    if (search) {
      where.OR = [
        { requester: { name: { contains: search, mode: 'insensitive' } } },
        { address: { line1: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [pickups, total, activePricing] = await Promise.all([
      this.prisma.pickup.findMany({
        where,
        include: {
          requester: { select: { userId: true, name: true, email: true, phoneNumber: true } },
          address: true,
          items: { include: { material: true } },
          snapshots: { include: { material: true } },
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take,
      }),
      this.prisma.pickup.count({ where }),
      this.prisma.collectorPricing.findMany({
        where: { collectorUserId: collectorId, status: 'ACTIVE' },
        select: { materialId: true, basePrice: true },
      }),
    ]);

    const activeMaterialIds = new Set(activePricing.map((p) => p.materialId));
    const pricingMap = new Map(
      activePricing.map((p) => [p.materialId, Number(p.basePrice)]),
    );

    const result = pickups.map((pickup) => ({
      ...pickup,
      isCompatible:
        pickup.items.length > 0 &&
        pickup.items.every((item) => activeMaterialIds.has(item.materialId)),
      items: pickup.items.map((item) => ({
        ...item,
        unitPrice: pricingMap.get(item.materialId) ?? 0,
      })),
    }));

    return paginate(result, total, page, limit);
  }

  // USER: Get all their own pickups
  async findAll(requesterUserId: string, query: PickupQueryDto) {
  const { page = 1, limit = 10, search, status, startDate, endDate } = query;
  const { skip, take } = getPaginationParams(page, limit);

  const where: any = { requesterUserId };
  if (status === PickupStatus.PENDING) {
    where.status = { in: [PickupStatus.PENDING, PickupStatus.ACCEPTED] };
  } else if (status) {
    where.status = status;
  } else {
    // No filter — fetch all, but ACCEPTED will be remapped to PENDING below
  }

  if (startDate || endDate) {
    where.scheduledAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    };
  }

  if (search) {
    where.OR = [
      { address: { line1: { contains: search, mode: 'insensitive' } } },
      { note: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [pickups, total] = await Promise.all([
    this.prisma.pickup.findMany({
      where,
      include: {
        items: { include: { material: true } },
        address: true,
        collector: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    this.prisma.pickup.count({ where }),
  ]);

  // Map ACCEPTED → PENDING so the customer only sees three statuses
  const mapped = pickups.map((p) => ({
    ...p,
    status: p.status === PickupStatus.ACCEPTED ? PickupStatus.PENDING : p.status,
  }));

  return paginate(mapped, total, page, limit);
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

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: collectorUserId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found. Please contact support');
    }

    const materialIds = pickup.items.map((item) => item.materialId);
    const collectorPricings = await this.prisma.collectorPricing.findMany({
      where: {
        collectorUserId,
        materialId: { in: materialIds },
        status: 'ACTIVE',
      },
    });

    let grossEarning = 0;
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
      grossEarning += item.quantity * priceUsed;

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

    if (Number(wallet.balance) < grossEarning) {
      throw new BadRequestException(
        `Insufficient wallet balance. You need at least $${grossEarning.toFixed(2)} to accept this pickup, but your balance is $${Number(wallet.balance).toFixed(2)}`,
      );
    }

    // estimatedEarning = gross payout to customer (what the collector will pay them).
    // The collector's actual earnings = their service fee, computed in the frontend from this value.
    const estimatedEarning = grossEarning;

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
        this.notificationService.notifyPickupStatusChanged({
          userId: pickup.requesterUserId,
          recipientEmail: requester.email,
          pickupId,
          status: 'ACCEPTED',
        }).catch(() => {});
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

    // Compute service fee so we can net the collector's deduction
    const collectorProfile = await this.prisma.collectorProfile.findUnique({
      where: { userId: collectorUserId },
      select: { serviceFee: true, feeType: true },
    });

    const rawFee = Number(collectorProfile?.serviceFee ?? 0);
    const feeType = collectorProfile?.feeType ?? 'PERCENTAGE';
    const serviceFeeAmount =
      feeType === 'PERCENTAGE' ? actualEarning * (rawFee / 100) : rawFee;
    // Net amount deducted from the collector = gross payout − service fee they earn back
    const collectorDebit = Math.max(0, actualEarning - serviceFeeAmount);

    // Complete pickup, credit customer, and debit collector in a single transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      const completedPickup = await tx.pickup.update({
        where: { pickupId },
        data: { status: 'COMPLETED', actualEarning },
        include: {
          items: { include: { material: true } },
          address: true,
          snapshots: true,
        },
      });

      // Credit the customer's wallet
      if (pickup.requesterUserId && actualEarning > 0) {
        const customerWallet = await tx.wallet.findUnique({
          where: { userId: pickup.requesterUserId },
        });

        if (customerWallet) {
          await tx.wallet.update({
            where: { walletId: customerWallet.walletId },
            data: { balance: { increment: actualEarning } },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: customerWallet.walletId,
              userId: pickup.requesterUserId,
              type: 'CREDIT',
              amount: actualEarning,
              status: 'COMPLETED',
              description: `Pickup completed – ${pickup.items.length} item(s) collected`,
              referenceType: 'PICKUP',
              referenceId: pickupId,
            },
          });
        }
      }

      // Debit the collector's wallet by the net payout (gross − service fee)
      if (collectorDebit > 0) {
        const collectorWallet = await tx.wallet.findUnique({
          where: { userId: collectorUserId },
        });

        if (collectorWallet) {
          await tx.wallet.update({
            where: { walletId: collectorWallet.walletId },
            data: { balance: { decrement: collectorDebit } },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: collectorWallet.walletId,
              userId: collectorUserId,
              type: 'DEBIT',
              amount: collectorDebit,
              status: 'COMPLETED',
              description: `Payout for pickup – ${pickup.items.length} item(s) collected`,
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
        this.notificationService.notifyPickupStatusChanged({
          userId: pickup.requesterUserId,
          recipientEmail: requester.email,
          pickupId,
          status: 'COMPLETED',
        }).catch(() => {});
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
        this.notificationService.notifyPickupStatusChanged({
          userId: pickup.requesterUserId,
          recipientEmail: requester.email,
          pickupId,
          status: 'CANCELLED',
        }).catch(() => {});
      }
    }

    return {
      message: 'Pickup cancelled successfully',
      pickup: cancelled,
    };
  }
  async rejectPickup(collectorId: string, pickupId: string, reason?: string, comment?: string) {
    const pickup = await this.prisma.pickup.findUnique({ where: { pickupId } });

    if (!pickup) throw new NotFoundException('Pickup not found');

    if (pickup.requesterUserId === collectorId) {
      throw new ForbiddenException('You cannot reject your own pickup request');
    }

    if (pickup.status !== PickupStatus.PENDING) {
      throw new BadRequestException(
        `Only PENDING pickups can be rejected. Current status: ${pickup.status}`,
      );
    }

    await this.prisma.pickupRejection.upsert({
      where:  { pickupId_collectorId: { pickupId, collectorId } },
      create: { pickupId, collectorId, reason, comment },
      update: { reason, comment },
    });

    return { message: 'Pickup rejected' };
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