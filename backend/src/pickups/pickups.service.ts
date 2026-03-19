import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';

@Injectable()
export class PickupsService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // USER: Schedule a pickup
  // ----------------------------------------------------------------
  async create(requesterUserId: string, createPickupDto: CreatePickupDto) {
    const { addressId, scheduledAt, items } = createPickupDto;

    // 1. Verify address belongs to the requesting user
    const address = await this.prisma.address.findFirst({
      where: { addressId, userId: requesterUserId },
    });
    if (!address) {
      throw new BadRequestException(
        'Address not found or does not belong to you',
      );
    }

    // 2. Verify all materials exist
    const materialIds = items.map((i) => i.materialId);
    const materials = await this.prisma.material.findMany({
      where: { materialId: { in: materialIds } },
    });
    if (materials.length !== materialIds.length) {
      throw new BadRequestException('One or more materials are invalid');
    }

    // 3. Create Pickup + PickupItems
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

    return {
      message: 'Pickup scheduled successfully',
      pickup,
    };
  }

  // ----------------------------------------------------------------
  // COLLECTOR: Get all PENDING pickup requests
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // USER: Get all their own pickups
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // Get a single pickup by ID
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // COLLECTOR: Accept a pickup
  // ----------------------------------------------------------------
  async accept(pickupId: string, collectorUserId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.status !== 'PENDING') {
      throw new BadRequestException(`Pickup is already ${pickup.status}`);
    }

    return this.prisma.pickup.update({
      where: { pickupId },
      data: {
        collectorUserId,
        status: 'ACCEPTED',
      },
      include: {
        items: { include: { material: true } },
        address: true,
      },
    });
  }

  // ----------------------------------------------------------------
  // Update a pickup (reschedule, update status)
  // ----------------------------------------------------------------
  async update(pickupId: string, updatePickupDto: UpdatePickupDto) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    return this.prisma.pickup.update({
      where: { pickupId },
      data: {
        ...(updatePickupDto.scheduledAt && {
          scheduledAt: new Date(updatePickupDto.scheduledAt),
        }),
        ...(updatePickupDto.status && { status: updatePickupDto.status }),
      },
      include: { items: true },
    });
  }

  // ----------------------------------------------------------------
  // Cancel a pickup
  // ----------------------------------------------------------------
  async cancel(pickupId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed pickup');
    }

    return this.prisma.pickup.update({
      where: { pickupId },
      data: { status: 'CANCELLED' },
    });
  }
}