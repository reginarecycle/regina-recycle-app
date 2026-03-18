import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessage } from '../common/error-message';
import { WithdrawDto } from 'src/common/dto/withdraw.dto';
import { TxType, TxStatus } from '@prisma/client';


@Injectable()
export class WalletService {

    constructor(private prisma: PrismaService) { }
    //-----------------------------------------------------------------------------
    // customer wallet
    // create a new wallet for a customer if one does not already exist
    async getOrCreateCustomerWallet(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }

        let customerWallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!customerWallet) {
            customerWallet = await this.prisma.wallet.create({
                data: {
                    userId,
                    balance: '0.00',
                },
            });
        }

        const monthlyEarningsAggregate = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: customerWallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        const yearlyEarningsAggregate = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: customerWallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            userId: customerWallet.userId,
            walletId: customerWallet.walletId,
            balance: Number(customerWallet.balance),
            monthlyEarnings: Number(monthlyEarningsAggregate._sum.amount ?? 0),
            yearlyEarnings: Number(yearlyEarningsAggregate._sum.amount ?? 0),
        };
    }

    //-----------------------------------------------------------------------------
    // collector wallet
    // create a new wallet for a collector if one does not already exist
    async getOrCreateCollectorWallet(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }

        let collectorWallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!collectorWallet) {
            collectorWallet = await this.prisma.wallet.create({
                data: {
                    userId,
                    balance: '0.00',
                },
            });
        }

        const monthlyPayoutsAggregate = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: collectorWallet.walletId,
                type: TxType.DEBIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        const monthlyCreditsAggregate = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: collectorWallet.walletId,
                type: TxType.CREDIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        const monthlyDebitsAggregate = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: collectorWallet.walletId,
                type: TxType.DEBIT,
                status: TxStatus.COMPLETED,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            userId: collectorWallet.userId,
            walletId: collectorWallet.walletId,
            balance: Number(collectorWallet.balance),
            monthlyPayouts: Number(monthlyPayoutsAggregate._sum.amount ?? 0),
            monthlyNetFlow:
                Number(monthlyCreditsAggregate._sum.amount ?? 0) -
                Number(monthlyDebitsAggregate._sum.amount ?? 0),
        };
    }

    private balance = 3000;
    // get the wallet balance
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
        page: number,
        limit: number,
        userId?: string,
        search?: string
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


    async withdrawFunds(userId: string, data: WithdrawDto) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        if (Number(data.amount) <= 0) {
            throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);
        }

        if (Number(wallet.balance) < Number(data.amount)) {
            throw new BadRequestException(ErrorMessage.INSUFFICIENT_BALANCE);
        }

        const updatedWallet = await this.prisma.wallet.update({
            where: { walletId: wallet.walletId },
            data: {
                balance: Number(wallet.balance) - Number(data.amount),
            },
        });

        const transaction = await this.prisma.walletTransaction.create({
            data: {
                userId,
                walletId: wallet.walletId,
                type: TxType.DEBIT,
                amount: Number(data.amount),
                status: TxStatus.PENDING,
                description: 'Withdrawal request',
                transactionDate: new Date(),
            },
        });

        return {
            message: 'Withdrawal request created',
            wallet: updatedWallet,
            transaction,
        };
    }

    async addFunds(userId: string, data: WithdrawDto) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException(ErrorMessage.WALLET_NOT_FOUND);
        }

        if (Number(data.amount) <= 0) {
            throw new BadRequestException(ErrorMessage.INVALID_AMOUNT);
        }

        const updatedWallet = await this.prisma.wallet.update({
            where: { walletId: wallet.walletId },
            data: {
                balance: Number(wallet.balance) + Number(data.amount),
            },
        });

        const transaction = await this.prisma.walletTransaction.create({
            data: {
                userId,
                walletId: wallet.walletId,
                type: TxType.CREDIT,
                amount: Number(data.amount),
                status: TxStatus.COMPLETED,
                description: 'Funds added',
                transactionDate: new Date(),
            },
        });

        return {
            message: 'Funds added successfully',
            wallet: updatedWallet,
            transaction,
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

        const totals = await this.prisma.walletTransaction.aggregate({
            where: {
                walletId: wallet.walletId,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
            _count: {
                transactionId: true,
            },
        });

        return {
            totalAmount: Number(totals._sum.amount ?? 0),
            totalTransactions: totals._count.transactionId,
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