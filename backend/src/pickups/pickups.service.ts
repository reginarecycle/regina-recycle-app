import { Injectable } from '@nestjs/common';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { PickupMaterialFactory } from './pickups.material.factory';

@Injectable()
export class PickupsService {
  create(createPickupDto: CreatePickupDto) {
    const material = PickupMaterialFactory.selectPickupMaterial(
      createPickupDto.materialName,
    );

    const estimatedCost =
      material.estimatedCostPerUnit * createPickupDto.quantity;

    return {
      message: 'Pickup scheduled successfully',
      pickup: {
        materialName: material.materialName,
        type: material.type,
        quantity: createPickupDto.quantity,
        pickupDate: createPickupDto.pickupDate,
        address: createPickupDto.address,
        estimatedCost,
      },
    };
  }

  findAll() {
    return `This action returns all pickups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pickup`;
  }

  update(id: number, updatePickupDto: UpdatePickupDto) {
    return `This action updates a #${id} pickup`;
  }

  remove(id: number) {
    return `This action removes a #${id} pickup`;
  }
}