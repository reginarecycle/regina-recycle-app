import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  getPickups(){
    return this.pickupsService.getPickups();
  }

  @Get(':id')
  getPickupById(@Param('id') id: string){
    return this.pickupsService.getPickupById(+id);
  }

  @Patch(':id')
  updatePickup(@Param('id') id: string, @Body() updatePickupDto: UpdatePickupDto,
  ){
    return this.pickupsService.updatePickup(+id, updatePickupDto);
  }

  @Delete(':id')
  cancelPickup(@Param('id') id: string){
    return this.pickupsService.cancelPickup(+id);
  }
}
