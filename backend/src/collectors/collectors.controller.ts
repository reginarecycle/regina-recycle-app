import {
  Controller,
  Get,
  Put,
  Patch,
  Post,
  Param,
  Query,
  Body,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '../common/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CollectorsService } from './collectors.service';
import { CollectorUsersQueryDto } from './dto/collectors-query.dto';
import { CollectorUsersQueryDto as CollectorQueryDto } from './dto/collectors-query.dto';
import { PickupQueryDto } from './dto/pickup-query.dto';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { CreateMaterialPricingDto } from './dto/create-material-pricing.dto';

type CurrentUserPayload = {
  userId: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'COLLECTOR';
  status: 'ACTIVE' | 'INACTIVE';
  emailVerified: boolean;
};

@ApiTags('Collectors')
@Controller('collectors')
export class CollectorsController {
  constructor(private readonly collectorsService: CollectorsService) {}

  // ─── Check materials availability ────────────────────────────────────────

  @Get('available-for-materials')
  @Auth()
  @ApiOperation({ summary: 'Check if collectors are available for given materials' })
  checkMaterialsAvailability(@Query('materialIds') materialIds: string | string[]) {
    const ids = Array.isArray(materialIds) ? materialIds : [materialIds];
    return this.collectorsService.checkMaterialsAvailability(ids);
  }

  // ─── Customer Stats (JWT) ─────────────────────────────────────────────────

  @Get('customers/stats')
  @Auth()
  getCustomerStats(@CurrentUser() user: CurrentUserPayload) {
    return this.collectorsService.getCustomerStats(user.userId);
  }

  // ─── Customers list (JWT) ─────────────────────────────────────────────────

  @Get('customers')
  @Auth()
  getCustomers(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: CollectorQueryDto,
  ) {
    return this.collectorsService.getCustomers(user.userId, query);
  }

  // ─── Customer detail (JWT) ────────────────────────────────────────────────

  @Get('customers/:customerId')
  @Auth()
  getCustomerDetails(
    @CurrentUser() user: CurrentUserPayload,
    @Param('customerId') customerId: string,
  ) {
    return this.collectorsService.getCustomerDetails(user.userId, customerId);
  }

  // ─── Pricing Settings (JWT) ───────────────────────────────────────────────

  @Get('pricing-settings')
  @ApiBearerAuth()
  @Auth()
  getPricingSettings(@CurrentUser() user: CurrentUserPayload) {
    return this.collectorsService.getMaterialSettings(user.userId);
  }

  @Patch('pricing-settings')
  @ApiBearerAuth()
  @Auth()
  updatePricingSettings(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateMaterialSettingsDto) {
    return this.collectorsService.updateMaterialSettings(user.userId, dto);
  }

  // ─── Me: Pricing list (JWT) ───────────────────────────────────────────────

  @Get('me/pricing')
  @ApiBearerAuth()
  @Auth()
  getMyPricing(@CurrentUser() user: CurrentUserPayload, @Query() query: CollectorUsersQueryDto) {
    return this.collectorsService.getPricing(user.userId, query);
  }

  // ─── Material Payout ──────────────────────────────────────────────────────

  @Get('material-pricing/:materialId/calculate')
  @Auth()
  async calculateMaterialPayout(
    @CurrentUser() user: CurrentUserPayload,
    @Param('materialId') materialId: string,
    @Query('quantity') quantity: string,
  ) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw new BadRequestException('Quantity must be a number greater than 0');
    }
    return this.collectorsService.calculateMaterialPayout(user.userId, materialId, qty);
  }

  // ─── Average Price ────────────────────────────────────────────────────────

  @Get('materials/:id/averagePrice')
  @ApiOperation({ summary: 'Get average material price across all collectors' })
  async getAverageMaterialPrice(@Param('id') id: string) {
    return this.collectorsService.getAverageMaterialPrice(id);
  }

  // ─── Stats by collectorId ─────────────────────────────────────────────────

  @Get(':collectorId/stats')
  @ApiOperation({ summary: 'Get collector stats' })
  @ApiParam({ name: 'collectorId', type: String })
  async getStats(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getStats(collectorId);
  }

  // ─── Pickups by collectorId ───────────────────────────────────────────────

  @Get(':collectorId/pickups')
  @ApiOperation({ summary: 'Get pickups for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPickups(@Param('collectorId') collectorId: string, @Query() query: PickupQueryDto) {
    return this.collectorsService.getPickups(collectorId, query);
  }

  // ─── Material Distribution ────────────────────────────────────────────────

  @Get(':collectorId/material-distribution')
  @ApiOperation({ summary: 'Get material distribution for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getMaterialDistribution(@Param('collectorId') collectorId: string, @Query('period') period?: string) {
    return this.collectorsService.getMaterialDistribution(collectorId, period);
  }

  // ─── Pickup Overview ──────────────────────────────────────────────────────

  @Get(':collectorId/pickup-overview')
  @ApiOperation({ summary: 'Get weekly pickup overview for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPickupOverview(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getPickupOverview(collectorId);
  }

  // ─── Top Locations ────────────────────────────────────────────────────────

  @Get(':collectorId/top-locations')
  @ApiOperation({ summary: 'Get top pickup locations for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getTopLocations(
    @Param('collectorId') collectorId: string,
    @Query('limit') limit?: number,
    @Query('period') period?: string,
  ) {
    return this.collectorsService.getTopLocations(collectorId, limit, period);
  }

  // ─── Profile ──────────────────────────────────────────────────────────────

  @Put(':collectorId/profile')
  @ApiOperation({ summary: 'Update collector profile' })
  @ApiParam({ name: 'collectorId', type: String })
  async updateProfile(@Param('collectorId') collectorId: string, @Body() dto: UpdateCollectorDto) {
    return this.collectorsService.updateProfile(collectorId, dto);
  }

  // ─── Pricing ──────────────────────────────────────────────────────────────

  @Get(':collectorId/pricing')
  @ApiOperation({ summary: 'Get pricing for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPricing(@Param('collectorId') collectorId: string, @Query() query: CollectorUsersQueryDto) {
    return this.collectorsService.getPricing(collectorId, query);
  }

  @Post(':collectorId/pricing')
  @ApiOperation({ summary: 'Create material pricing for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async createMaterialPricing(@Param('collectorId') collectorId: string, @Body() dto: CreateMaterialPricingDto) {
    return this.collectorsService.createMaterialPricing(collectorId, dto);
  }

  @Put(':collectorId/pricing/:materialId')
  @ApiOperation({ summary: 'Update material pricing for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  @ApiParam({ name: 'materialId', type: String })
  async updateMaterialPricing(
    @Param('collectorId') collectorId: string,
    @Param('materialId') materialId: string,
    @Body() dto: UpdateMaterialPricingDto,
  ) {
    return this.collectorsService.updateMaterialPricing(collectorId, materialId, dto);
  }

  // ─── Material Settings ────────────────────────────────────────────────────

  @Get(':collectorId/material-settings')
  @ApiOperation({ summary: 'Get material settings for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getMaterialSettings(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getMaterialSettings(collectorId);
  }

  @Put(':collectorId/material-settings')
  @ApiOperation({ summary: 'Update material settings for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async updateMaterialSettings(@Param('collectorId') collectorId: string, @Body() dto: UpdateMaterialSettingsDto) {
    return this.collectorsService.updateMaterialSettings(collectorId, dto);
  }
}