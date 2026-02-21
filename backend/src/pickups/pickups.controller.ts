import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { CreatePickupDto } from './dto/create-pickup.dto';

@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  @Post()
  create(@Body() body: CreatePickupDto) {
    const userId = 'temp';
    return this.pickupsService.create(userId, body);
  }

  @Get()
  findAll() {
    const userId = 'temp';
    return this.pickupsService.findAll(userId);
  }

  @Get(':pickupId')
  findOne(@Param('pickupId') pickupId: string) {
    return this.pickupsService.findOne(pickupId);
  }
}
