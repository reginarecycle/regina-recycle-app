import { WalletService } from './wallet.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { WithdrawDto } from 'src/common/dto/withdraw.dto';
import { WalletTransactionDTO } from './dto/wallet-transaction.dto';
import { CustomerWalletDto } from './dto/customerWallet.dto';
import { CollectorWalletDto } from './dto/collectorWallet.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CustomerWithdrawFundsDto } from './dto/customerWithdrawFunds.dto';
import { TopUpRequestsDto } from './dto/topUpRequests.dto';


@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  //  create a wallet summary for a customer
  // wallets are not created since we can only have 1 wallet per user
  @Post('customer')
  @Auth()
  async getCustomerWallet(@CurrentUser('id') userId: string) {
    return this.walletService.getOrCreateCustomerWallet(userId);
  }

  // create a wallet summary for a collector
  @Get('collector')
  @Auth()
  async getCollectorWallet(@CurrentUser('id') userId: string) {
    return this.walletService.getOrCreateCollectorWallet(userId);
  }
  // get the balance for the wallet
  @Get('balance')
  @Auth()
  async getWalletBalance(@CurrentUser('id') userId: string) {
    return this.walletService.getWalletBalance(userId);
  }

  // get the wallet transaction history
  @Get('transactions')
  @Auth()
  async getWalletTransactions(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.walletService.getWalletTransactions(userId, page, limit, search);
  }
  // get a single wallet transaction by id
  @Get('transactions/:transactionId')
  @Auth()
  async getTransactionById(
    @CurrentUser('id') userId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.walletService.getTransactionById(userId, transactionId);
  }

  // post the customer withdrawal request
  @Post('withdraw')
  @Auth()
  async withdrawFunds(
    @CurrentUser('id') userId: string,
    @Body() customerWithdrawFundsDto: CustomerWithdrawFundsDto,
  ) {
    return this.walletService.withdrawFunds(userId, customerWithdrawFundsDto);
  }

  // collector top-up request
  @Post('top-up')
  @Auth()
  async addFunds(
    @CurrentUser('id') userId: string,
    @Body() topUpRequestsDto: TopUpRequestsDto,
  ) {
    return this.walletService.addFunds(userId, topUpRequestsDto);
  }

  // wallet stats
  @Get('stats')
  @Auth()
  async getWalletStats(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletStats(userId, startDate, endDate);
  }


  // wallet earnings
  @Get('earnings')
  @Auth()
  async getWalletEarnings(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletEarnings(userId, startDate, endDate);
  }
}