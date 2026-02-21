import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CollectorsService } from './collectors.service';


@Controller('collectors')
export class CollectorsController {
  constructor(private readonly collectorsService: CollectorsService) {}

  @Get('stats')
  @UseGuards()
  getStats(/* @CurrentUser() user: User */) {
    const collectorId = 'temp-collector-id';
    return this.collectorsService.getStats(collectorId);
  }

  @Get('material-distribution')
  @UseGuards()
  getMaterialDistribution(
  /* @CurrentUser() user: User, */
  @Query('period') period?: string, // 'month', 'week', 'year'
  ) {
      const collectorId = 'temp-collector-id';
    return this.collectorsService.getMaterialDistribution(collectorId, period);
  }

  @Get('pickup-overview')
  @UseGuards()
  getPickupOverview(/* @CurrentUser() user: User */) {
    const collectorId = 'temp-collector-id';
    return this.collectorsService.getPickupOverview(collectorId);
  }

  @Get('pickups')
  @UseGuards()
  getPickups(
    /* @CurrentUser() user: User, */
    @Query('status') status?: string, // 'PENDING', 'ACCEPTED', 'COMPLETED'
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const collectorId = 'temp-collector-id';
    return this.collectorsService.getPickups(
      collectorId,
      status,
      limit,
      offset,
    );
  }

  @Get('top-locations')
  @UseGuards()
  getTopLocations(/* @CurrentUser() user: User */
    @Query('limit') limit?: number,
    @Query('period') period?: string, // 'month', 'week', 'year'  
  ) {
    const collectorId = 'temp-collector-id';
    return this.collectorsService.getTopLocations(collectorId, limit, period);
  }

  @Get('customers')
  @UseGuards()
  getCustomers(
    /* @CurrentUser() user: User */
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('offset') offset?: number,
  ) {
    const collectorId = 'temp-collector-id';
    return this.collectorsService.getCustomers(collectorId, search, limit, offset);
  }

  @Get('customers/:customerId')
  // @UseGuards(JwtAuthGuard, CollectorGuard)
  getCustomerDetails(
    /* @CurrentUser() user: User, */
    @Param('customerId') customerId: string,
  ) {
    const collectorId = 'temp-user-id';  
    return this.collectorsService.getCustomerDetails(collectorId, customerId);
  }

  @Patch('profile')
  // @UseGuards(JwtAuthGuard, CollectorGuard)
  updateProfile(
    /* @CurrentUser() user: User, */
    @Body() dto: any,
  ) {
    const collectorId = 'temp-user-id';
    return this.collectorsService.updateProfile(collectorId, dto);
  }
  @Get('me/pricing')
  // @UseGuards(JwtAuthGuard, CollectorGuard)
  getPricing(
    /* @CurrentUser() user: User, */
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const userId = 'temp-user-id';
    return this.collectorsService.getPricing(
      userId,
      page,
      limit,
      search,
      status,
    );
  }

  @Patch('pricing/:materialId')
  @UseGuards()
  updateMaterialPricing(
  // @CurrentUser() user: User,
  @Param('materialId') materialId: string,
  @Body() dto: any,
  ) {
    const collectorId = 'temp-user-id';  
    return this.collectorsService.updateMaterialPricing(collectorId, materialId, dto);
  }

  @Get('pricing-settings')
  @UseGuards()
  getMaterialSettings(/* @CurrentUser() user: User */) {
    const userId = 'temp-user-id';
    return this.collectorsService.getMaterialSettings(userId);
  }

  @Patch('pricing-settings')
  @UseGuards()
  updateMaterialSettings(
    /* @CurrentUser() user: User, */
    @Body() dto: any,
  ) {
    const userId = 'temp-user-id';
    return this.collectorsService.updateMaterialSettings(userId, dto);
  }

}



