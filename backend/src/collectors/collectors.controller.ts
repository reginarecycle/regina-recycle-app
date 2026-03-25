import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CollectorsService } from './collectors.service';
import { CollectorUsersQueryDto } from './dto/collectors-query.dto';
//import { CollectorQueryDto } from './dto/collectors-query.dto'
import { PickupQueryDto } from './dto/pickup-query.dto';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { CreateMaterialPricingDto } from './dto/create-material-pricing.dto';
import { Auth } from '../common/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

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

  // ─── Stats ────────────────────────────────────────────────────────────────

 @Get('stats')
 @Auth()
 getStats(@CurrentUser() user: CurrentUserPayload) {
   return this.collectorsService.getStats(user.userId);
 }


  // ─── Pickups ──────────────────────────────────────────────────────────────
@Get('pickups')
  @Auth('COLLECTOR')
  getPickups(
    @CurrentUser() user: CurrentUserPayload,
   @Query() query: PickupQueryDto,
) {
  return this.collectorsService.getPickups(user.userId, query);
}

  // ─── Customers ────────────────────────────────────────────────────────────


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
@Get('me/pricing')
 @Auth()
 getPricing(
   @CurrentUser() user: CurrentUserPayload,
   @Query() query: CollectorUsersQueryDto,
 ) {
   return this.collectorsService.getPricing(user.userId, query);
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

  // ─── Material Payout Calculation ──────────────────────────────────────────

  @Get('material-pricing/:materialId/calculate')
  async calculateMaterialPayout(
    @Param('materialId') materialId: string,
    @Query('collectorId') collectorId: string,
    @Query('quantity') quantity: string,
  ) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw new BadRequestException('Quantity must be a number greater than 0');
    }
    return this.collectorsService.calculateMaterialPayout(
      collectorId,
      materialId,
      qty,
    );
  }

  // ─── Average Material Price ───────────────────────────────────────────────

  @Get('materials/:id/averagePrice')
  async getAverageMaterialPrice(@Param('id') id: string) {
    return this.collectorsService.getAverageMaterialPrice(id);
  }
}