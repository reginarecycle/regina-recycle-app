import { WalletService } from './wallet.service';
import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { WithdrawDto } from 'src/common/dto/withdraw.dto';
import { WalletTransactionDTO } from './dto/wallet-transaction.dto';
import { CustomerWalletDto } from './dto/customerWallet.dto';
import { CollectorWalletDto } from './dto/collectorWallet.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';


@Controller('wallet')
export class WalletController {
  //   constructor(private readonly walletService: WalletService) { }

  //   // create a wallet for a new customer
  //   @Post()
  //   @Auth()
  //   create(@CurrentUser() user: User, @Body() CustomerWalletDto: CustomerWalletDto) {
  //     return this.create(user.userId, CustomerWalletDto);
  //   }

  //   // create a new wallet for a new collector

  //   @Get('balance')
  //   @Auth()
  //   getWalletBalance() {
  //     return this.walletService.getWalletBalance();
  //   }

  //   @Get('transactions')
  //   @Auth()
  //   getWalletTransactions(
  //     // @Query() query: PaginationDto,
  //     @Query('userId') userId?: string,
  //     @Query('search') search?: string,) {
  //     // const page = Number(query.page) || 1;
  //     // const limit = Number(query.limit) || 10;

  //     // return this.walletService.getWalletTransactions(page, limit, userId, search);
  //   }

  //   @Get('transactions/:id')
  //   @Auth()
  //   getTransactionById(@Param('id') id: string) {
  //     return this.walletService.getTransactionById(id);
  //   }

  //   @Get('stats')
  //   @Auth()
  //   getWalletStats(
  //     @Query('startDate') startDate?: string,
  //     @Query('endDate') endDate?: string,
  //   ) {
  //     return this.walletService.getWalletStats(startDate, endDate);
  //   }

  //   @Get('earnings')
  //   @Auth()
  //   getWalletEarnings(
  //     @Query('startDate') startDate?: string,
  //     @Query('endDate') endDate?: string,
  //   ) {
  //     return this.walletService.getWalletEarnings(startDate, endDate);
  //   }

  //   @Post('withdraw')
  //   @Auth()
  //   withdrawFunds(@Body() data: WithdrawDto) {
  //     return this.walletService.withdrawFunds(data);
  //   }

  //   @Post('add-funds')
  //   @Auth()
  //   addFunds(@Body() data: WithdrawDto) {
  //     return this.walletService.addFunds(data);
  //   }
}