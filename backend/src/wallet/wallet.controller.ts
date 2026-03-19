import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { type User } from '@prisma/client/wasm';
import { WalletService } from './wallet.service';
import { Auth } from '../common/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CustomerWithdrawFundsDto } from './dto/customerWithdrawFunds.dto';
import { TopUpRequestsDto } from './dto/topUpRequests.dto';
import { WalletTransactionQueryDto } from './dto/walletTransactionQuery.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('customer')
  @Auth()
  getCustomerWallet(@CurrentUser() user: User) {
    return this.walletService.getOrCreateCustomerWallet(user.userId);
  }

  @Get('collector')
  @Auth()
  getCollectorWallet(@CurrentUser() user: User) {
    return this.walletService.getOrCreateCollectorWallet(user.userId);
  }

  @Get('balance')
  @Auth()
  getWalletBalance(@CurrentUser() user: User) {
    return this.walletService.getWalletBalance(user.userId);
  }

  @Get('transactions')
  @Auth()
  getWalletTransactions(
    @CurrentUser() user: User,
    @Query() query: WalletTransactionQueryDto,
  ) {
    return this.walletService.getWalletTransactions(user.userId, query);
  }

  @Get('transactions/:transactionId')
  @Auth()
  async getTransactionById(
    @Param('transactionId') transactionId: string,
    @CurrentUser('id') userId: string,
  ) {
    const isOwner = await this.walletService.validateTransactionOwnership(
      transactionId,
      userId,
    );

    if (!isOwner) {
      throw new UnauthorizedException(
        'You do not have access to this transaction',
      );
    }

    return this.walletService.getTransactionById(transactionId);
  }

  @Post('withdraw')
  @Auth()
  withdrawFunds(
    @CurrentUser() user: User,
    @Body() customerWithdrawFundsDto: CustomerWithdrawFundsDto,
  ) {
    return this.walletService.withdrawFunds(user.userId, customerWithdrawFundsDto);
  }

  @Post('top-up')
  @Auth()
  addFunds(
    @CurrentUser() user: User,
    @Body() topUpRequestsDto: TopUpRequestsDto,
  ) {
    return this.walletService.addFunds(user.userId, topUpRequestsDto);
  }

  @Get('stats')
  @Auth()
  getWalletStats(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletStats(user.userId, startDate, endDate);
  }

  @Get('earnings')
  @Auth()
  getWalletEarnings(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletEarnings(user.userId, startDate, endDate);
  }
}