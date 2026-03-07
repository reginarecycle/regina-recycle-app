import { WalletService } from './wallet.service';
import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { WithdrawDto } from './dto/withdraw.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

@Get('balance')
 getWalletBalance(){
  return this.walletService.getWalletBalance();
 }

@Get('transactions')
 getWalletTransactions( @Query() query: PaginationDto){
  const page = Number (query.page) || 1;
  const limit = Number (query.limit) || 10;

  return this.walletService.getWalletTransactions(page ,limit);
 }

 @Get('transactions/:id')
 getTransactionById(@Param('id') id: string){
  return this.walletService.getTransactionById(+id);
 }

 @Post('withdraw')
 withdrawFunds(@Body() data: WithdrawDto){
  return this.walletService.withdrawFunds(data);
 }

}
