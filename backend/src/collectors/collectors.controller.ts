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
import { CollectorsService } from './collectors.service';
import { CollectorUsersQueryDto } from './dto/collectors-query.dto';
import { PickupQueryDto } from './dto/pickup-query.dto';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { CreateMaterialPricingDto } from './dto/create-material-pricing.dto';

@ApiTags('Collectors')
@Controller('collectors')
export class CollectorsController {
  constructor(private readonly collectorsService: CollectorsService) { }

  // ─── Non-parameterized routes FIRST ──────────────────────────────────────

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard stats for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getDashboardStats(@Request() req: any) {
    return this.collectorsService.getDashboardStats(req.user.userId);
  }

  @Get('available-for-materials')
  @Auth()
  @ApiOperation({ summary: 'Check if collectors are available for given materials' })
  checkMaterialsAvailability(
    @Query('materialIds') materialIds: string | string[],
  ) {
    const ids = Array.isArray(materialIds) ? materialIds : [materialIds];
    return this.collectorsService.checkMaterialsAvailability(ids);
  }

  @Get('material-pricing/:materialId/calculate')
  @ApiOperation({ summary: 'Calculate material payout' })
  async calculateMaterialPayout(
    @Param('materialId') materialId: string,
    @Query('collectorId') collectorId: string,
    @Query('quantity') quantity: string,
  ) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw new BadRequestException('Quantity must be a number greater than 0');
    }
    return this.collectorsService.calculateMaterialPayout(collectorId, materialId, qty);
  }

  @Get('materials/:id/averagePrice')
  @ApiOperation({ summary: 'Get average material price across all collectors' })
  async getAverageMaterialPrice(@Param('id') id: string) {
    return this.collectorsService.getAverageMaterialPrice(id);
  }

  @Get('pricing-settings')
  @ApiOperation({ summary: 'Get pricing settings for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getPricingSettings(@Request() req: any) {
    return this.collectorsService.getMaterialSettings(req.user.userId);
  }

  @Patch('pricing-settings')
  @ApiOperation({ summary: 'Update pricing settings for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  updatePricingSettings(@Request() req: any, @Body() dto: UpdateMaterialSettingsDto) {
    return this.collectorsService.updateMaterialSettings(req.user.userId, dto);
  }

  @Get('me/pricing')
  @ApiOperation({ summary: 'Get material pricing for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getMyPricing(@Request() req: any, @Query() query: CollectorUsersQueryDto) {
    return this.collectorsService.getPricing(req.user.userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get stats for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getStats(@Request() req: any) {
    return this.collectorsService.getStats(req.user.userId);
  }

  @Get('pickup-overview')
  @ApiOperation({ summary: 'Get weekly pickup overview for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getPickupOverview(@Request() req: any) {
    return this.collectorsService.getPickupOverview(req.user.userId);
  }

  @Get('material-distribution')
  @ApiOperation({ summary: 'Get material distribution for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getMaterialDistributionMe(
    @Request() req: any,
    @Query('period') period?: string,
  ) {
    return this.collectorsService.getMaterialDistribution(req.user.userId, period);
  }

  @Get('top-locations')
  @ApiOperation({ summary: 'Get top locations for the authenticated collector' })
  @ApiBearerAuth()
  @Auth('COLLECTOR')
  getTopLocationsMe(
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('period') period?: string,
  ) {
    return this.collectorsService.getTopLocations(req.user.userId, limit, period);
  }

  @Get(':collectorId/stats')
  @ApiOperation({ summary: 'Get collector stats by ID' })
  @ApiParam({ name: 'collectorId', type: String })
  async getStatsByCollectorId(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getStats(collectorId);
  }

  @Get(':collectorId/pickups')
  @ApiOperation({ summary: 'Get pickups for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPickupsByCollectorId(
    @Param('collectorId') collectorId: string,
    @Query() query: PickupQueryDto,
  ) {
    return this.collectorsService.getPickups(collectorId, query);
  }

  @Get(':collectorId/customers')
  @ApiOperation({ summary: 'Get customers for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getCustomers(
    @Param('collectorId') collectorId: string,
    @Query() query: CollectorUsersQueryDto,
  ) {
    return this.collectorsService.getCustomers(collectorId, query);
  }

  @Get(':collectorId/customers/:customerId')
  @ApiOperation({ summary: 'Get customer detail for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  @ApiParam({ name: 'customerId', type: String })
  async getCustomerDetails(
    @Param('collectorId') collectorId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.collectorsService.getCustomerDetails(collectorId, customerId);
  }

  @Get(':collectorId/users/stats')
  @ApiOperation({ summary: 'Get user stats for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getCollectorUsersStats(
    @Param('collectorId') collectorId: string,
  ) {
    return this.collectorsService.getUsersStats(collectorId);
  }

  @Get(':collectorId/users')
  @ApiOperation({ summary: 'Get paginated users for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getCollectorUsers(
    @Param('collectorId') collectorId: string,
    @Query() query: CollectorUsersQueryDto,
  ) {
    return this.collectorsService.getUsers(collectorId, query);
  }

  @Get(':collectorId/material-distribution')
  @ApiOperation({ summary: 'Get material distribution for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getMaterialDistribution(
    @Param('collectorId') collectorId: string,
    @Query('period') period?: string,
  ) {
    return this.collectorsService.getMaterialDistribution(collectorId, period);
  }

  @Get(':collectorId/pickup-overview')
  @ApiOperation({ summary: 'Get weekly pickup overview for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPickupOverviewByCollectorId(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getPickupOverview(collectorId);
  }

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

  @Put(':collectorId/profile')
  @ApiOperation({ summary: 'Update collector profile' })
  @ApiParam({ name: 'collectorId', type: String })
  async updateProfile(
    @Param('collectorId') collectorId: string,
    @Body() dto: UpdateCollectorDto,
  ) {
    return this.collectorsService.updateProfile(collectorId, dto);
  }

  @Get(':collectorId/pricing')
  @ApiOperation({ summary: 'Get pricing for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPricing(
    @Param('collectorId') collectorId: string,
    @Query() query: CollectorUsersQueryDto,
  ) {
    return this.collectorsService.getPricing(collectorId, query);
  }

  @Post(':collectorId/pricing')
  @ApiOperation({ summary: 'Create material pricing for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async createMaterialPricing(
    @Param('collectorId') collectorId: string,
    @Body() dto: CreateMaterialPricingDto,
  ) {
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

  @Get(':collectorId/material-settings')
  @ApiOperation({ summary: 'Get material settings for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getMaterialSettings(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getMaterialSettings(collectorId);
  }

  @Put(':collectorId/material-settings')
  @ApiOperation({ summary: 'Update material settings for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async updateMaterialSettings(
    @Param('collectorId') collectorId: string,
    @Body() dto: UpdateMaterialSettingsDto,
  ) {
    return this.collectorsService.updateMaterialSettings(collectorId, dto);
  }
}