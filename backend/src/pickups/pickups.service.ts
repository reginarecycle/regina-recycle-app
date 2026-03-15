// src/pickups/pickups.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { PickupPricingFactory } from './pickups.material.factory';

@Injectable()
export class PickupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(requesterUserId: string, createPickupDto: CreatePickupDto) {
    const { scheduledAt, addressId, items } = createPickupDto;

    const address = await this.prisma.address.findFirst({
      where: { addressId, userId: requesterUserId },
    });
    if (!address) {
      throw new BadRequestException('Address not found or does not belong to you');
    }

    const materialIds = items.map((i) => i.materialId);
    const materials = await this.prisma.material.findMany({
      where: { materialId: { in: materialIds } },
    });
    if (materials.length !== materialIds.length) {
      throw new BadRequestException('One or more materials are invalid');
    }

    const pickup = await this.prisma.pickup.create({
      data: {
        requesterUserId,
        scheduledAt: new Date(scheduledAt),
        addressId,
        status: 'PENDING',
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

    return { message: 'Pickup scheduled successfully', pickup };
  }

  async findAll() {
    return this.prisma.pickup.findMany({
      where: { status: 'PENDING' },
      include: {
        items: { include: { material: true } },
        address: true,
        requester: {
          select: { userId: true, name: true, email: true, phoneNumber: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async accept(pickupId: string, collectorUserId: string) {
    // 1. Get pickup
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
      include: { items: true },
    });
    if (!pickup) throw new NotFoundException('Pickup not found');
    if (pickup.status !== 'PENDING') {
      throw new BadRequestException(`Pickup is already ${pickup.status}`);
    }

    // 2. Get collector profile
    const collectorProfile = await this.prisma.collectorProfile.findUnique({
      where: { userId: collectorUserId },
    });
    if (!collectorProfile) {
      throw new BadRequestException('Collector profile not found');
    }

    // ✅ 2.5 Check collector wallet exists
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: collectorUserId },
    });
    if (!wallet) {
      throw new BadRequestException('Collector wallet not found');
    }

    // 3. Get active pricing for all materials
    const pricings = await this.prisma.collectorPricing.findMany({
      where: {
        collectorUserId,
        materialId: { in: pickup.items.map((i) => i.materialId) },
        status: 'ACTIVE',
      },
    });

    // 4. Factory selects strategy per item → calculates total
    let totalEstimatedEarning = new Decimal(0);
    const snapshotDataList: any[] = [];

    for (const item of pickup.items) {
      const pricing = pricings.find((p) => p.materialId === item.materialId);
      if (!pricing) {
        throw new BadRequestException(
          `You have no active pricing for material: ${item.materialId}`,
        );
      }

      const strategy = PickupPricingFactory.selectStrategy(
        item.quantity,
        collectorProfile,
      );

      const priceUsed = strategy.getPricePerUnit(
        pricing.basePrice,
        pricing.bulkPrice,
      );

      totalEstimatedEarning = totalEstimatedEarning.add(
        priceUsed.mul(item.quantity),
      );

      snapshotDataList.push({
        pickupId,
        materialId: item.materialId,
        quantity: item.quantity,
        basePrice: pricing.basePrice,
        bulkPrice: pricing.bulkPrice,
        bulkThreshold: collectorProfile.bulkIncentiveEnabled
          ? collectorProfile.bulkThreshold
          : null,
        priceUsed,
      });
    }

    // ✅ 4.5 Reject if collector can't afford to pay the user
    if (wallet.balance < totalEstimatedEarning) {
      throw new BadRequestException(
        `Insufficient wallet balance. Need $${totalEstimatedEarning} but collector only has $${wallet.balance}`,
      );
    }

    // 5. Atomic transaction: update pickup + create snapshots
    const [updatedPickup] = await this.prisma.$transaction([
      this.prisma.pickup.update({
        where: { pickupId },
        data: {
          collectorUserId,
          status: 'ACCEPTED',
          estimatedEarning: totalEstimatedEarning,
        },
        include: {
          items: { include: { material: true } },
          snapshots: true,
          address: true,
        },
      }),
      ...snapshotDataList.map((s) =>
        this.prisma.pickupSnapshot.create({ data: s }),
      ),
    ]);

    return {
      message: 'Pickup accepted successfully',
      pickup: updatedPickup,
      estimatedEarning: totalEstimatedEarning,
    };
  }

  async update(pickupId: string, updatePickupDto: UpdatePickupDto) {
    const pickup = await this.prisma.pickup.findUnique({ where: { pickupId } });
    if (!pickup) throw new NotFoundException('Pickup not found');

    return this.prisma.pickup.update({
      where: { pickupId },
      data: updatePickupDto as any,
      include: { items: true, snapshots: true },
    });
  }

  async remove(pickupId: string) {
    const pickup = await this.prisma.pickup.findUnique({ where: { pickupId } });
    if (!pickup) throw new NotFoundException('Pickup not found');
    if (pickup.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed pickup');
    }

    return this.prisma.pickup.update({
      where: { pickupId },
      data: { status: 'CANCELLED' },
    });
  }
}