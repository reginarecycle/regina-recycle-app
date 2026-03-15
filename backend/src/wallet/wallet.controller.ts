import { WalletService } from './wallet.service';
import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { WithdrawDto } from '../common/dto/withdraw.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('balance')
  getWalletBalance() {
    return this.walletService.getWalletBalance();
  }

  @Get('transactions')
  getWalletTransactions(
    @Query() query: PaginationDto,
    @Query('userId') userId?: string,
    @Query('search') search?: string,) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return this.walletService.getWalletTransactions(page, limit, userId, search);
  }

  @Get('transactions/:id')
  getTransactionById(@Param('id') id: string) {
    return this.walletService.getTransactionById(id);
  }

  @Get('stats')
  getWalletStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletStats(startDate, endDate);
  }

  @Get('earnings')
  getWalletEarnings(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletEarnings(startDate, endDate);
  }

  @Post('withdraw')
  withdrawFunds(@Body() data: WithdrawDto) {
    return this.walletService.withdrawFunds(data);
  }

  @Post('add-funds')
  addFunds(@Body() data: WithdrawDto) {
    return this.walletService.addFunds(data);
  }
}