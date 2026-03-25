import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    // 1. Get completed pickups with items and materials
    const completedPickups = await this.prisma.pickup.findMany({
      where: { requesterUserId: userId, status: 'COMPLETED' },
      include: {
        items: { include: { material: true } },
      },
    });

    // 2. Calculate CO2 Saved, Water Saved, Total Recycle Quantity
    let co2Saved            = 0;
    let waterSaved          = 0;
    let totalRecycleQuantity = 0;

    for (const pickup of completedPickups) {
      for (const item of pickup.items) {
        totalRecycleQuantity += item.quantity;
        co2Saved             += (item.material.co2Saved   || 0) * item.quantity;
        waterSaved           += (item.material.waterSaved || 0) * item.quantity;
      }
    }

    // 3. Pending Earnings
    const pendingPickups = await this.prisma.pickup.findMany({
      where: {
        requesterUserId: userId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
      select: { estimatedEarning: true },
    });

    const pendingEarnings = pendingPickups.reduce(
      (sum, p) => sum + Number(p.estimatedEarning || 0),
      0,
    );

    return {
      co2Saved,
      waterSaved,
      totalRecycleQuantity,
      pendingEarnings,
    };
  }
}