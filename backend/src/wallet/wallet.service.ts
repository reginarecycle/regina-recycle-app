import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async creditUser(userId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async getBalance(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
      select: { balance: true },
    });
  }

  async getTransactions(userId: string) {
    return this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEarnings(userId: string, period: string) {
    return { period, data: [] };
  }

  async withdraw(userId: string, amount: number) {
    return this.prisma.withdrawRequest.create({
      data: {
        userId,
        amount,
        interacEmail: 'placeholder@email.com',
      },
    });
  }
}
