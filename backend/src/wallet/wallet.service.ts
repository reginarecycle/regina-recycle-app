import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessage } from '../common/error-message';
import { CustomerWithdrawFundsDto } from './dto/customerWithdrawFunds.dto';
import { TopUpRequestsDto } from './dto/topUpRequests.dto';
import { TxStatus, TxType } from '@prisma/client';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async getOrCreateCustomerWallet(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }

        let wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: {
                    userId,
                },
            });
        }

        const now = new Date();

        const monthlyEarnings = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        const yearlyEarnings = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(now.getFullYear(), 0, 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            userId: wallet.userId,
            walletId: wallet.walletId,
            balance: Number(wallet.balance),
            monthlyEarnings: Number(monthlyEarnings._sum.amount ?? 0),
            yearlyEarnings: Number(yearlyEarnings._sum.amount ?? 0),
        };
    }

    async getOrCreateCollectorWallet(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }

        let wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: {
                    userId,
                },
            });
        }

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyPayouts = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.DEBIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: monthStart,
                },
            },
            _sum: {
                amount: true,
            },
        });

        const monthlyCredits = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: monthStart,
                },
            },
            _sum: {
                amount: true,
            },
        });

        const monthlyDebits = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.DEBIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: monthStart,
                },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            userId: wallet.userId,
            walletId: wallet.walletId,
            balance: Number(wallet.balance),
            monthlyPayouts: Number(monthlyPayouts._sum.amount ?? 0),
            monthlyNetFlow:
                Number(monthlyCredits._sum.amount ?? 0) -
                Number(monthlyDebits._sum.amount ?? 0),
        };
    }

    async getWalletBalance(userId: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        return {
            walletId: wallet.walletId,
            balance: Number(wallet.balance),
            currency: 'CAD',
        };
    }

    async getWalletTransactions(
        userId: string,
        page: number,
        limit: number,
        search?: string,
    ) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        const skip = (page - 1) * limit;

        return this.prisma.walletTransaction.findMany({
            where: {
                walletId: wallet.walletId,
                OR: search
                    ? [
                        { description: { contains: search, mode: 'insensitive' } },
                        { referenceId: { contains: search, mode: 'insensitive' } },
                        { referenceType: { contains: search, mode: 'insensitive' } },
                    ]
                    : undefined,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getTransactionById(userId: string, transactionId: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        const transaction = await this.prisma.walletTransaction.findFirst({
            where: {
                transactionId,
                walletId: wallet.walletId,
            },
        });

        if (!transaction) {
            throw new NotFoundException(ErrorMessage.TRANSACTION_NOT_FOUND);
        }

        return transaction;
    }

    async withdrawFunds(userId: string, withdrawDto: CustomerWithdrawFundsDto) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        if (withdrawDto.amount <= 0) {
            throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);
        }

        if (Number(wallet.balance) < withdrawDto.amount) {
            throw new BadRequestException(ErrorMessage.INSUFFICIENT_BALANCE);
        }

        const withdrawRequest = await this.prisma.withdrawRequest.create({
            data: {
                userId,
                interacEmail: withdrawDto.interacEmail,
                securityQuestion: withdrawDto.securityQuestion,
                securityAnswer: withdrawDto.securityAnswer,
                amount: withdrawDto.amount,
                status: withdrawDto.status ?? TxStatus.PENDING,
            },
        });

        return {
            message: 'Withdraw request created successfully',
            withdrawRequest,
        };
    }

    async addFunds(userId: string, topUpDto: TopUpRequestsDto) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        if (topUpDto.amount <= 0) {
            throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);
        }

        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: {
                paymentMethodId: topUpDto.paymentMethodId,
                userId,
            },
        });

        if (!paymentMethod) {
            throw new NotFoundException(ErrorMessage.PAYMENT_METHOD_NOT_FOUND);
        }

        const topUpRequest = await this.prisma.topUpRequest.create({
            data: {
                userId,
                paymentMethodId: topUpDto.paymentMethodId,
                amount: topUpDto.amount,
                status: topUpDto.status ?? TxStatus.PENDING,
            },
        });

        return {
            message: 'Top up request created successfully',
            topUpRequest,
        };
    }

    async getWalletStats(userId: string, startDate?: string, endDate?: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        const dateFilter =
            startDate && endDate
                ? {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                }
                : {};

        const credits = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.CREDIT,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        });

        const debits = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                type: TxType.DEBIT,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        });

        const totalTransactions = await this.prisma.walletTransaction.count({
            where: {
                walletId: wallet.walletId,
                ...dateFilter,
            },
        });

        return {
            totalCredits: Number(credits._sum.amount ?? 0),
            totalDebits: Number(debits._sum.amount ?? 0),
            totalTransactions,
        };
    }

    async getWalletEarnings(userId: string, startDate?: string, endDate?: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        return this.prisma.walletTransaction.findMany({
            where: {
                walletId: wallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async validateOwnership(walletId: string, userId: string): Promise<boolean> {
        const wallet = await this.prisma.wallet.findFirst({
            where: {
                walletId,
                userId,
            },
        });

        if (!wallet) {
            throw new UnauthorizedException(ErrorMessage.WALLET_NO_ACCESS);
        }

        return !!wallet;
    }
}