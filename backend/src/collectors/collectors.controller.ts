import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { CollectorsService } from './collectors.service';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
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


@Controller('collectors')
export class CollectorsController {
  constructor(private readonly collectorsService: CollectorsService) {}

  @Get('stats')
  @Auth()
   getStats(@CurrentUser() user: CurrentUserPayload) {
    return this.collectorsService.getStats(user.userId);
  }

  @Get('material-distribution')
  @Auth()
  getMaterialDistribution(
  @CurrentUser() user: CurrentUserPayload,
    @Query('period') period?: string,
  ) {
    return this.collectorsService.getMaterialDistribution(user.userId, period);
  }

  @Get('pickup-overview')
  @Auth()
   getPickupOverview(@CurrentUser() user: CurrentUserPayload) {
    return this.collectorsService.getPickupOverview(user.userId);
  }

  @Get('pickups')
  @Auth()
  getPickups(
    @CurrentUser() user: CurrentUserPayload,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.collectorsService.getPickups(
      user.userId,
      status,
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }

  @Get('top-locations')
  @Auth()
  getTopLocations(@CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: string,
    @Query('period') period?: string,
  ) {
    return this.collectorsService.getTopLocations(
      user.userId,
      Number(limit) || 3,
      period,
    );
  }

  @Get('customers')
   @Auth()
  getCustomers(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('offset') offset?: string,
  ) {
    return this.collectorsService.getCustomers(
      user.userId,
      search,
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }

  @Get('customers/:customerId')
   @Auth()
  getCustomerDetails(
   @CurrentUser() user: CurrentUserPayload,
    @Param('customerId') customerId: string,
  ) {
    return this.collectorsService.getCustomerDetails(user.userId, customerId);
  }

  @Patch('profile')
  @Auth()
  updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateCollectorDto,
  ) {
    return this.collectorsService.updateProfile(user.userId, dto);
  }

  @Get('me/pricing')
  @Auth()
  getPricing(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.collectorsService.getPricing(
      user.userId,
      Number(limit) || 10,
      Number(offset) || 0,
      search,
      status,
    );
  }

  @Patch('pricing/:materialId')
  @Auth()
  updateMaterialPricing(
    @CurrentUser() user: CurrentUserPayload,
    @Param('materialId') materialId: string,
    @Body() dto: UpdateMaterialPricingDto,
  ) {
    return this.collectorsService.updateMaterialPricing(
      user.userId,
      materialId,
      dto,
    );
  }

  @Get('pricing-settings')
   @Auth()
  getMaterialSettings( @CurrentUser() user: CurrentUserPayload) {
    return this.collectorsService.getMaterialSettings(user.userId);
  }


  @Patch('pricing-settings')
   @Auth()
  updateMaterialSettings(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateMaterialSettingsDto,
  ) {
    return this.collectorsService.updateMaterialSettings(user.userId, dto);
  }


}



