import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { type User, Role } from '@prisma/client';
import { WalletService } from './wallet.service';
import { Auth } from '../common/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WalletTransactionQueryDto } from './dto/wallettransaction.dto';
import { TopUpRequestsDto } from './dto/topuprequest.dto';
import { CustomerWithdrawFundsDto } from './dto/customerwithdrawfunds.dto';
import { CollectorWithdrawFundsDto } from './dto/collectorwithdrawfunds.dto';

@ApiTags('Wallet')
@ApiBearerAuth('JWT-auth')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ── Customer wallet ───────────────────────────────────────────────────────────

  @Get('customer')
  @Auth()
  @ApiOperation({ summary: 'Get or create customer wallet with earnings summary' })
  getCustomerWallet(@CurrentUser() user: User) {
    if (user.role !== Role.CUSTOMER) {
      throw new ForbiddenException('Only customers can access this endpoint');
    }
    return this.walletService.getOrCreateCustomerWallet(user.userId);
  }

  // ── Collector wallet ──────────────────────────────────────────────────────────

  @Get('collector')
  @Auth()
  @ApiOperation({ summary: 'Get or create collector wallet with payout summary' })
  getCollectorWallet(@CurrentUser() user: User) {
    if (user.role !== Role.COLLECTOR) {
      throw new ForbiddenException('Only collectors can access this endpoint');
    }
    return this.walletService.getOrCreateCollectorWallet(user.userId);
  }

  // ── Shared: balance ───────────────────────────────────────────────────────────

  @Get('balance')
  @Auth()
  @ApiOperation({ summary: 'Get current wallet balance' })
  getWalletBalance(@CurrentUser() user: User) {
    return this.walletService.getWalletBalance(user.userId);
  }

  // ── Shared: transactions ──────────────────────────────────────────────────────

  @Get('transactions')
  @Auth()
  @ApiOperation({ summary: 'Get wallet transactions with filters and pagination' })
  getWalletTransactions(
    @CurrentUser() user: User,
    @Query() query: WalletTransactionQueryDto,
  ) {
    return this.walletService.getWalletTransactions(user.userId, query);
  }

  @Get('transactions/:transactionId')
  @Auth()
  @ApiOperation({ summary: 'Get a single transaction by ID' })
  async getTransactionById(
    @Param('transactionId') transactionId: string,
    @CurrentUser() user: User,
  ) {
    const isOwner = await this.walletService.validateTransactionOwnership(
      transactionId,
      user.userId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('You do not have access to this transaction');
    }

    return this.walletService.getTransactionById(transactionId);
  }

  // ── Customer: top up ──────────────────────────────────────────────────────────

  @Post('top-up')
  @Auth()
  @ApiOperation({ summary: 'Collector — add funds to wallet to pay for pickups' })
  addFunds(
    @CurrentUser() user: User,
    @Body() dto: TopUpRequestsDto,
  ) {
    if (user.role !== Role.COLLECTOR) {
      throw new ForbiddenException('Only collectors can top up their wallet');
    }
    return this.walletService.addFunds(user.userId, dto);
  }

  // ── Customer: withdraw (Interac) ──────────────────────────────────────────────

  @Post('withdraw')
  @Auth()
  @ApiOperation({ summary: 'Customer — withdraw funds via Interac e-Transfer' })
  withdrawFunds(
    @CurrentUser() user: User,
    @Body() dto: CustomerWithdrawFundsDto,
  ) {
    if (user.role !== Role.CUSTOMER) {
      throw new ForbiddenException('Only customers can use this withdrawal method');
    }
    return this.walletService.withdrawFunds(user.userId, dto);
  }

  // ── Collector: withdraw (bank transfer) ───────────────────────────────────────

  @Post('withdraw/collector')
  @Auth()
  @ApiOperation({ summary: 'Collector — withdraw funds via bank transfer' })
  withdrawCollectorFunds(
    @CurrentUser() user: User,
    @Body() dto: CollectorWithdrawFundsDto,
  ) {
    if (user.role !== Role.COLLECTOR) {
      throw new ForbiddenException('Only collectors can use this withdrawal method');
    }
    return this.walletService.withdrawCollectorFunds(user.userId, dto);
  }

  // ── Shared: stats ─────────────────────────────────────────────────────────────

  @Get('stats')
  @Auth()
  @ApiOperation({ summary: 'Get wallet credit/debit stats with optional date range' })
  getWalletStats(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletStats(user.userId, startDate, endDate);
  }

  // ── Shared: earnings ──────────────────────────────────────────────────────────

  @Get('earnings')
  @Auth()
  @ApiOperation({ summary: 'Get completed credit transactions' })
  getWalletEarnings(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.walletService.getWalletEarnings(user.userId, startDate, endDate);
  }
}