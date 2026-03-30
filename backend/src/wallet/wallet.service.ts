import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

function generateReferenceNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `RRY-${digits}`;
}
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessage } from '../common/error-message';
import { TxStatus, TxType, PaymentMethodType } from '@prisma/client';
import { NotificationGatewayService } from '../notifications/notifications.gateway.service';
import { WalletTransactionQueryDto } from './dto/wallettransaction.dto';
import { TopUpRequestsDto } from './dto/topuprequest.dto';
import { CustomerWithdrawFundsDto } from './dto/customerWithdrawFunds.dto';
import { CollectorWithdrawFundsDto } from './dto/collectorWithdrawFunds.dto';


@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private notificationGatewayService: NotificationGatewayService,
  ) { }

  // ── Private helpers ───────────────────────────────────────────────────────────

  private async findOrCreateWallet(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({ data: { userId } });
    }
    return { wallet, user };
  }

  private async shouldNotify(
    userId: string,
    type: 'accountActivity' | 'alert' | 'marketing',
  ): Promise<boolean> {
    const prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (!prefs) return true;
    switch (type) {
      case 'accountActivity': return prefs.emailAccountActivity;
      case 'alert': return prefs.inAppAlerts;
      case 'marketing': return prefs.emailMarketing;
      default: return true;
    }
  }

  // ── Customer wallet ───────────────────────────────────────────────────────────

  async getOrCreateCustomerWallet(userId: string) {
    const { wallet } = await this.findOrCreateWallet(userId);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [monthlyEarnings, yearlyEarnings, pendingEarnings, prevMonthEarnings] =
      await Promise.all([
        this.prisma.walletTransaction.aggregate({
          where: { walletId: wallet.walletId, type: TxType.CREDIT, status: TxStatus.COMPLETED, createdAt: { gte: monthStart } },
          _sum: { amount: true },
        }),
        this.prisma.walletTransaction.aggregate({
          where: { walletId: wallet.walletId, type: TxType.CREDIT, status: TxStatus.COMPLETED, createdAt: { gte: yearStart } },
          _sum: { amount: true },
        }),
        this.prisma.walletTransaction.aggregate({
          where: { walletId: wallet.walletId, type: TxType.CREDIT, status: TxStatus.PENDING },
          _sum: { amount: true },
        }),
        this.prisma.walletTransaction.aggregate({
          where: { walletId: wallet.walletId, type: TxType.CREDIT, status: TxStatus.COMPLETED, createdAt: { gte: prevMonthStart, lt: monthStart } },
          _sum: { amount: true },
        }),
      ]);

    const current = Number(monthlyEarnings._sum.amount ?? 0);
    const previous = Number(prevMonthEarnings._sum.amount ?? 0);

    return {
      userId: wallet.userId,
      walletId: wallet.walletId,
      balance: Number(wallet.balance),
      monthlyEarnings: current,
      yearlyEarnings: Number(yearlyEarnings._sum.amount ?? 0),
      pendingEarningsAmount: Number(pendingEarnings._sum.amount ?? 0),
      earningsChangeAmount: current - previous,
    };
  }

  // ── Collector wallet ──────────────────────────────────────────────────────────

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  async getOrCreateCollectorWallet(userId: string) {
    const { wallet } = await this.findOrCreateWallet(userId);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [monthlyCredits, monthlyDebits, pendingRequests] = await Promise.all([
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.walletId,
          type: TxType.CREDIT,
          status: TxStatus.COMPLETED,
          createdAt: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.walletId,
          type: TxType.DEBIT,
          status: TxStatus.COMPLETED,
          createdAt: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.walletId,
          type: TxType.DEBIT,
          status: TxStatus.PENDING,
        },
        _sum: { amount: true },
      }),
    ]);

    const credits = Number(monthlyCredits._sum.amount ?? 0);
    const debits = Number(monthlyDebits._sum.amount ?? 0);
    const pending = Number(pendingRequests._sum.amount ?? 0);

    const currentNetFlow = credits - debits;

    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [previousCredits, previousDebits] = await Promise.all([
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.walletId,
          type: TxType.CREDIT,
          status: TxStatus.COMPLETED,
          createdAt: { gte: previousMonthStart, lte: previousMonthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.walletId,
          type: TxType.DEBIT,
          status: TxStatus.COMPLETED,
          createdAt: { gte: previousMonthStart, lte: previousMonthEnd },
        },
        _sum: { amount: true },
      }),
    ]);

    const prevCredits = Number(previousCredits._sum.amount ?? 0);
    const prevDebits = Number(previousDebits._sum.amount ?? 0);
    const previousNetFlow = prevCredits - prevDebits;

    const monthlyPayoutsChange = this.calculatePercentageChange(debits, prevDebits);
    const monthlyNetChange = this.calculatePercentageChange(currentNetFlow, previousNetFlow);

    return {
      userId: wallet.userId,
      walletId: wallet.walletId,
      balance: Number(wallet.balance),
      monthlyPayouts: debits,
      monthlyPayoutsChange,
      monthlyNetFlow: currentNetFlow,
      monthlyNetChange,
      pendingRequestsAmount: pending,
      pendingApprovalAmount: pending,
    };
  }

  // ── Balance ───────────────────────────────────────────────────────────────────

  async getWalletBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);

    return {
      walletId: wallet.walletId,
      balance: Number(wallet.balance),
      currency: 'CAD',
    };
  }

  // ── Transactions ──────────────────────────────────────────────────────────────

  async getWalletTransactions(userId: string, query: WalletTransactionQueryDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);

    const { page = 1, limit = 10, search, type, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where = {
      walletId: wallet.walletId,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      ...(startDate || endDate
        ? { createdAt: { ...(startDate ? { gte: new Date(startDate) } : {}), ...(endDate ? { lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) } : {}) } }
        : {}),
      ...(search
        ? {
          OR: [
            { description: { contains: search, mode: 'insensitive' as const } },
            { referenceId: { contains: search, mode: 'insensitive' as const } },
            { referenceType: { contains: search, mode: 'insensitive' as const } },
          ]
        }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.walletTransaction.count({ where }),
    ]);

    return {
      data: transactions.map((t) => ({
        transactionId: t.transactionId,
        referenceNumber: t.referenceNumber ?? undefined,
        userId: wallet.userId,
        walletId: t.walletId,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
        description: t.description ?? undefined,
        referenceType: t.referenceType ?? undefined,
        referenceId: t.referenceId ?? undefined,
        createdAt: t.createdAt,
      })),
      meta: { total, page, limit, hasNextPage: skip + limit < total },
    };
  }

  async getTransactionById(transactionId: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({ where: { transactionId } });
    if (!transaction) throw new NotFoundException(ErrorMessage.TRANSACTION_NOT_FOUND);

    return {
      walletId: transaction.walletId,
      type: transaction.type,
      amount: Number(transaction.amount),
      status: transaction.status,
      description: transaction.description ?? undefined,
      referenceType: transaction.referenceType ?? undefined,
      referenceId: transaction.referenceId ?? undefined,
      createdAt: transaction.createdAt,
    };
  }

  // ── Top up (customer) — auto-approve + credit immediately ────────────────────

  async addFunds(userId: string, dto: TopUpRequestsDto) {
    const { wallet, user } = await this.findOrCreateWallet(userId);

    if (dto.amount <= 0) throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);

    const methodLabel =
      dto.paymentType === PaymentMethodType.CARD
        ? `${dto.cardBrand ?? 'Card'} ending in ${dto.cardLast4 ?? '****'}`
        : `${dto.mobileProvider ?? 'Mobile payment'}`;

    const [topUpRequest, , updatedWallet] = await this.prisma.$transaction([
      this.prisma.topUpRequest.create({
        data: {
          userId,
          amount: dto.amount,
          status: TxStatus.COMPLETED,
          processedAt: new Date(),
        },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.walletId,
          userId,
          type: TxType.CREDIT,
          amount: dto.amount,
          status: TxStatus.COMPLETED,
          description: `Top-up via ${methodLabel}`,
          referenceType: 'TOP_UP',
          referenceNumber: generateReferenceNumber(),
        },
      }),
      this.prisma.wallet.update({
        where: { walletId: wallet.walletId },
        data: { balance: { increment: dto.amount } },
      }),
    ]);

    const canNotify = await this.shouldNotify(userId, 'accountActivity');
    if (canNotify) {
      await this.notificationGatewayService.notifyWalletUpdated({
        userId,
        recipientEmail: user.email,
        amount: dto.amount,
        balance: Number(updatedWallet.balance),
        type: 'CREDIT',
      });
    }

    return {
      message: 'Funds added successfully',
      amount: dto.amount,
      newBalance: Number(updatedWallet.balance),
      topUpRequest,
    };
  }

  // ── Customer withdraw (Interac) — debit immediately ──────────────────────────

  async withdrawFunds(userId: string, dto: CustomerWithdrawFundsDto) {
    const { wallet, user } = await this.findOrCreateWallet(userId);

    if (dto.amount <= 0) throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);

    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException(ErrorMessage.INSUFFICIENT_BALANCE);
    }

    const [withdrawRequest, , updatedWallet] = await this.prisma.$transaction([
      // ← only ONE create
      this.prisma.withdrawRequest.create({
        data: {
          userId,
          withdrawType: 'INTERAC',
          interacEmail: dto.interacEmail,
          securityQuestion: dto.securityQuestion,
          securityAnswer: dto.securityAnswer,
          amount: dto.amount,
          status: TxStatus.COMPLETED,
          processedAt: new Date(),
        },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.walletId,
          userId,
          type: TxType.DEBIT,
          amount: dto.amount,
          status: TxStatus.COMPLETED,
          description: `Interac withdrawal to ${dto.interacEmail}`,
          referenceType: 'WITHDRAWAL',
          referenceNumber: generateReferenceNumber(),
        },
      }),
      this.prisma.wallet.update({
        where: { walletId: wallet.walletId },
        data: { balance: { decrement: dto.amount } },
      }),
    ]);

    const canNotify = await this.shouldNotify(userId, 'accountActivity');
    if (canNotify) {
      await this.notificationGatewayService.notifyWalletUpdated({
        userId,
        recipientEmail: user.email,
        amount: dto.amount,
        balance: Number(updatedWallet.balance),
        type: 'DEBIT',
      });
    }

    return {
      message: 'Withdrawal processed successfully',
      amount: dto.amount,
      newBalance: Number(updatedWallet.balance),
      withdrawRequest,
    };
  }

  // ── Collector withdraw (bank transfer) — debit immediately ───────────────────

  async withdrawCollectorFunds(userId: string, dto: CollectorWithdrawFundsDto) {
    const { wallet, user } = await this.findOrCreateWallet(userId);

    if (dto.amount <= 0) throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);

    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException(ErrorMessage.INSUFFICIENT_BALANCE);
    }

    const [withdrawRequest, , updatedWallet] = await this.prisma.$transaction([
      // ← only ONE create, with the correct bank fields
      this.prisma.withdrawRequest.create({
        data: {
          userId,
          withdrawType: 'BANK_TRANSFER',
          bankName: dto.bankName,
          accountHolderName: dto.accountHolderName,
          accountNumber: `****${dto.accountNumber.slice(-4)}`,
          routingNumber: dto.routingNumber,
          institutionNumber: dto.institutionNumber,
          amount: dto.amount,
          status: TxStatus.COMPLETED,
          processedAt: new Date(),
        },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.walletId,
          userId,
          type: TxType.DEBIT,
          amount: dto.amount,
          status: TxStatus.COMPLETED,
          description: `Bank withdrawal to ${dto.bankName} — ${dto.accountHolderName}`,
          referenceType: 'WITHDRAWAL',
          referenceNumber: generateReferenceNumber(),
        },
      }),
      this.prisma.wallet.update({
        where: { walletId: wallet.walletId },
        data: { balance: { decrement: dto.amount } },
      }),
    ]);

    const canNotify = await this.shouldNotify(userId, 'accountActivity');
    if (canNotify) {
      await this.notificationGatewayService.notifyWalletUpdated({
        userId,
        recipientEmail: user.email,
        amount: dto.amount,
        balance: Number(updatedWallet.balance),
        type: 'DEBIT',
      });
    }

    return {
      message: 'Withdrawal processed successfully',
      amount: dto.amount,
      newBalance: Number(updatedWallet.balance),
      withdrawRequest,
    };
  }

  // ── Stats & earnings ──────────────────────────────────────────────────────────

  async getWalletStats(userId: string, startDate?: string, endDate?: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);

    const dateFilter = startDate || endDate
      ? { createdAt: { ...(startDate ? { gte: new Date(startDate) } : {}), ...(endDate ? { lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) } : {}) } }
      : {};

    const [credits, debits, totalTransactions] = await Promise.all([
      this.prisma.walletTransaction.aggregate({ where: { walletId: wallet.walletId, type: TxType.CREDIT, ...dateFilter }, _sum: { amount: true } }),
      this.prisma.walletTransaction.aggregate({ where: { walletId: wallet.walletId, type: TxType.DEBIT, ...dateFilter }, _sum: { amount: true } }),
      this.prisma.walletTransaction.count({ where: { walletId: wallet.walletId, ...dateFilter } }),
    ]);

    return {
      totalCredits: Number(credits._sum.amount ?? 0),
      totalDebits: Number(debits._sum.amount ?? 0),
      totalTransactions,
    };
  }

  async getWalletEarnings(userId: string, startDate?: string, endDate?: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);

    const earnings = await this.prisma.walletTransaction.findMany({
      where: {
        walletId: wallet.walletId,
        type: TxType.CREDIT,
        status: TxStatus.COMPLETED,
        createdAt: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) } : {}),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      earnings: earnings.map((t) => ({
        userId: wallet.userId,
        walletId: t.walletId,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
        description: t.description ?? undefined,
        referenceType: t.referenceType ?? undefined,
        referenceId: t.referenceId ?? undefined,
        createdAt: t.createdAt,
      })),
    };
  }

  // ── Ownership validation ──────────────────────────────────────────────────────

  async validateOwnership(walletId: string, userId: string): Promise<boolean> {
    const wallet = await this.prisma.wallet.findFirst({ where: { walletId, userId } });
    if (!wallet) throw new UnauthorizedException(ErrorMessage.WALLET_NO_ACCESS);
    return true;
  }

  async validateTransactionOwnership(transactionId: string, userId: string): Promise<boolean> {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new UnauthorizedException(ErrorMessage.WALLET_NO_ACCESS);

    const transaction = await this.prisma.walletTransaction.findFirst({
      where: { transactionId, walletId: wallet.walletId },
    });
    if (!transaction) throw new UnauthorizedException(ErrorMessage.TRANSACTION_NO_ACCESS);
    return true;
  }

  // ── Notification helpers (called by other services e.g. pickups) ──────────────

  async notifyWalletCredit(userId: string, amount: number, balance: number) {
    const user = await this.prisma.user.findUnique({ where: { userId }, select: { email: true } });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    const canNotify = await this.shouldNotify(userId, 'accountActivity');
    if (canNotify) {
      await this.notificationGatewayService.notifyWalletUpdated({ userId, recipientEmail: user.email, amount, balance, type: 'CREDIT' });
    }
  }

  async notifyWalletDebit(userId: string, amount: number, balance: number) {
    const user = await this.prisma.user.findUnique({ where: { userId }, select: { email: true } });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    const canNotify = await this.shouldNotify(userId, 'accountActivity');
    if (canNotify) {
      await this.notificationGatewayService.notifyWalletUpdated({ userId, recipientEmail: user.email, amount, balance, type: 'DEBIT' });
    }
  }
}