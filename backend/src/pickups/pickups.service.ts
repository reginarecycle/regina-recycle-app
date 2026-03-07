import { Injectable } from '@nestjs/common';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';

@Injectable()
export class PickupsService {
  schedulePickup(createPickupDto: CreatePickupDto) {
    return 'This action schedules a new pickup';
  }

  getPickups() {
    return `This action returns all pickups`;
  }

  getPickupById(id: number) {
    return `This action returns a #${id} pickup`;
  }

  updatePickup(id: number, updatePickupDto: UpdatePickupDto) {
    return `This action updates a #${id} pickup`;
  }

  cancelPickup(id: number) {
    return `This action removes a #${id} pickup`;
  }
}
