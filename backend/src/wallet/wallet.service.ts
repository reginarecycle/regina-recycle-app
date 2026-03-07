import { Injectable } from '@nestjs/common';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class WalletService {

    private balance = 3000;
    getWalletBalance(){
    return{
        balance: this.balance,
        currency: "CAD"
    };
    }

    getWalletTransactions (page: number, limit: number){
        return{
            page,
            limit,
            transactions: []
        };
    }

    getTransactionById(id: number){

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
    }







