import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';

@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  @Post()
  schedulePickup(@Body() createPickupDto: CreatePickupDto){
    return this.pickupsService.schedulePickup(createPickupDto);
  }

  @Get()
  getPickups(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ){
    return this.pickupsService.getPickups(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get('request-stats')
  getRequestStats(){
    return this.pickupsService.getRequestStats();
  }

  @Get(':id')
  getPickupById(@Param('id') id: string){
    return this.pickupsService.getPickupById(id);
  }



  @Patch(':id')
  updatePickup(@Param('id') id: string, @Body() updatePickupDto: UpdatePickupDto,
  ){
    return this.pickupsService.updatePickup(id, updatePickupDto);
  }

  @Patch(':id/accept')
  acceptPickup(@Param('id') id: string){
    return this.pickupsService.acceptPickup(id);
  }

  @Delete(':id')
  cancelPickup(@Param('id') id: string){
    return this.pickupsService.cancelPickup(id);
  }
}
