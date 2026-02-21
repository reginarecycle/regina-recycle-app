import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

//get wallet balance
@Get('balance')
getBalance(){
  const userId = 'temp';
  return this.walletService.getBalance(userId);
}

//get transactions
@Get('transactions')
getTransactions(){
  const userId = 'temp';
  return this.walletService.getTransactions(userId);
}

//Earnings view
@Get('earnings')
getEarnings(@Query('period')period: string ){
  const userId = 'temp';
  return this.walletService.getEarnings(userId, period);
}

//withdraw funds
@Post ('withdraw')
withdraw(@Body() body: any){
  const userId = 'temp';
  return this.walletService.withdraw(userId, body.amount);
}

}
