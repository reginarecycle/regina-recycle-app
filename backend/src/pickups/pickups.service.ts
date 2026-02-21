import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { Injectable } from '@nestjs/common';
import { PickupStatus } from '@prisma/client';

@Injectable()
export class PickupsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  //create pickup
  async create(userId: string, body: any) {
    return this.prisma.pickup.create({
      data: {
        requesterUserId: userId,
        scheduledAt: new Date(body.scheduledAt),
        addressId: body.addressId,
        status: PickupStatus.PENDING,
        items: {
          create: body.items?.map((item: any) => ({
            materialId: item.materialId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.pickup.findMany({
      where: { requesterUserId: userId },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(pickupId: string) {
    return this.prisma.pickup.findUnique({
      where: { pickupId },
      include: {
        items: true,
        address: true,
      },
    });
  }
}
