import { Injectable } from '@nestjs/common';
import { WithdrawDto } from '../common/dto/withdraw.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {

    constructor(private prisma: PrismaService){}

    private balance = 3000;

    getWalletBalance(){
    return{
        balance: this.balance,
        currency: "CAD"
    };
    }

    async getWalletTransactions (
        page: number, 
        limit: number,
        userId?: string,
        search?: string
        ){
        const skip = (page - 1) * limit;
        return this.prisma.walletTransaction.findMany({
            where:{
                userId: userId || undefined,
                OR: search
                ?[
                   { description: {contains: search, mode: 'insensitive'} },
                   {referenceId: {contains: search, mode: 'insensitive'} },
                ] :undefined,
                
            },

            skip,
            take: limit,
            orderBy:{
                createdAt:'desc',
            },
        });
    }

    getTransactionById(id: string){

        return{
            id,
            amount: 150,
            status: "credit"
        };
    }

        withdrawFunds(data: WithdrawDto){
        this.balance -= data.amount || 0;

        return {
            message: "Withdraw request created",
            newBalance: this.balance
        };
        }


    async getWalletStats(startDate?: string, endDate?: string){
        const dateFilter = startDate && endDate?
        {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        }
        :{};
        const totals = await this.prisma.walletTransaction.aggregate({
            where:{
                ...dateFilter,
            },
            _sum:{
                amount: true,
            },
        });
        return {
            totalPayout: totals._sum.amount || 0,
        };

    }

    async getWalletEarnings(startDate?: string, endDate?: string){
        return this.prisma.walletTransaction.findMany({
            where:{
                createdAt:{
                    gte: startDate? new Date(startDate): undefined,
                    lte: endDate? new Date (endDate) : undefined,
                },
            },
            orderBy:{
                createdAt: 'desc',
            },
        });
    }

     addFunds(data: WithdrawDto){
        this.balance += data.amount || 0;
        return{
            message: "Funds added successfully",
            newBalance: this.balance
        };

     }
    


    }







