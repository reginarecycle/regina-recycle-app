// ─────────────────────────────────────────────────────────────────────────────
// ADD these two imports to the top of your existing collectors.controller.ts
// ─────────────────────────────────────────────────────────────────────────────
// import { CollectorUsersQueryDto } from './dto/collector-users-query.dto';
// import { Query } from '@nestjs/common';   // if not already imported
// ─────────────────────────────────────────────────────────────────────────────

import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CollectorsService } from './collectors.service';
import { CollectorUsersQueryDto as CollectorQueryDto } from './dto/collectors-query.dto';
import { PickupQueryDto } from './dto/pickup-query.dto';
import { CollectorUsersQueryDto } from './dto/collectors-query.dto';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { CreateMaterialPricingDto } from './dto/create-material-pricing.dto';

@ApiTags('Collectors')
@Controller('collectors')
export class CollectorsController {
  constructor(private readonly collectorsService: CollectorsService) {}

  // ─── Stats ────────────────────────────────────────────────────────────────

  @Get(':collectorId/stats')
  @ApiOperation({ summary: 'Get collector stats' })
  @ApiParam({ name: 'collectorId', type: String })
  async getStats(@Param('collectorId') collectorId: string) {
    return this.collectorsService.getStats(collectorId);
  }

  // ─── Pickups ──────────────────────────────────────────────────────────────

  @Get(':collectorId/pickups')
  @ApiOperation({ summary: 'Get pickups for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPickups(
    @Param('collectorId') collectorId: string,
    @Query() query: PickupQueryDto,
  ) {
    return this.collectorsService.getPickups(collectorId, query);
  }

  // ─── Customers ────────────────────────────────────────────────────────────

  @Get(':collectorId/customers')
  @ApiOperation({ summary: 'Get customers for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getCustomers(
    @Param('collectorId') collectorId: string,
    @Query() query: CollectorQueryDto,
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

  // ─── NEW: Users ────────────────────────────────────────────────────────────
  // NOTE: /users/stats MUST be declared before /users to prevent NestJS
  //       treating 'stats' as a collectorId param value.

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

  // ─── Material Distribution ────────────────────────────────────────────────

  @Get(':collectorId/material-distribution')
  @ApiOperation({ summary: 'Get material distribution for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getMaterialDistribution(
    @Param('collectorId') collectorId: string,
    @Query('period') period?: string,
  ) {
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
  async updateProfile(
    @Param('collectorId') collectorId: string,
    @Body() dto: UpdateCollectorDto,
  ) {
    return this.collectorsService.updateProfile(collectorId, dto);
  }

  // ─── Pricing ──────────────────────────────────────────────────────────────

  @Get(':collectorId/pricing')
  @ApiOperation({ summary: 'Get pricing for a collector' })
  @ApiParam({ name: 'collectorId', type: String })
  async getPricing(
    @Param('collectorId') collectorId: string,
    @Query() query: CollectorQueryDto,
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
  async updateMaterialSettings(
    @Param('collectorId') collectorId: string,
    @Body() dto: UpdateMaterialSettingsDto,
  ) {
    return this.collectorsService.updateMaterialSettings(collectorId, dto);
  }

  @Get('material-pricing/:materialId/calculate')
  @Auth()
  calculateMaterialPayout(
  @CurrentUser() user: CurrentUserPayload,
  @Param('materialId') materialId: string,
  @Query('quantity') quantity: string,
) {
  const qty = Number(quantity);

  if (isNaN(qty) || qty <= 0) {
    throw new BadRequestException('Quantity must be a number greater than 0');
  }

  return this.collectorsService.calculateMaterialPayout(
    user.userId,
    materialId,
    qty,
  );
}


@Get('materials/:id/averagePrice')
@Auth()
getAverageMaterialPrice(@Param('id') id: string) {
   return this.collectorsService.getAverageMaterialPrice(id);
 }

}



