import { Controller, Get, Post, Patch, Param, Query, Body, BadRequestException } from '@nestjs/common';
import { CollectorsService } from './collectors.service';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { Auth } from '../common/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CreateMaterialPricingDto} from './dto/create-material-pricing.dto';
import { CollectorQueryDto } from './dto/collectors-query.dto';
import { PickupQueryDto } from './dto/pickup-query.dto';

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
  @Auth('COLLECTOR')
  getPickups(
    @CurrentUser() user: CurrentUserPayload,
   @Query() query: PickupQueryDto,
) {
  return this.collectorsService.getPickups(user.userId, query);
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
  @Query() query: CollectorQueryDto,
) {
  return this.collectorsService.getCustomers(user.userId, query);
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

 @Post('pricing')
 @Auth()
 createMaterialPricing(
  @CurrentUser() user: CurrentUserPayload,
  @Body() dto: CreateMaterialPricingDto,
) {
  return this.collectorsService.createMaterialPricing(user.userId, dto);
}


  @Get('me/pricing')
  @Auth()
  getPricing(
    @CurrentUser() user: CurrentUserPayload,
     @Query() query: CollectorQueryDto,
) {
  return this.collectorsService.getPricing(user.userId, query);
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



