import { Injectable } from '@nestjs/common';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PickupsService {

  constructor (private prisma: PrismaService) {}

  async schedulePickup(createPickupDto: CreatePickupDto) {
    return this.prisma.pickup.create({
      data: {
        scheduledAt: createPickupDto.scheduledAt,
        requesterUserId: createPickupDto.requesterUserId,
        addressId: createPickupDto.addressId,
        status: 'PENDING',
      },
    });
  }

  async getPickups(page = 1, limit = 10) {

    const skip = (page - 1) * limit;


    return this.prisma.pickup.findMany({
      skip,
      take: limit,
      orderBy:{
        createdAt:'desc',
      },
    });
  }

  async getPickupById(id: string) {
    return this.prisma.pickup.findUnique({
      where:{
        pickupId: id,
      },
    });
  }

async updatePickup(id: string, updatePickupDto: UpdatePickupDto) {
    return this.prisma.pickup.update({
      where: {pickupId: id},
      data: updatePickupDto,
    });
  }

  async getRequestStats(){
    const perfectMatch = await this.prisma.pickup.count({
      where: {status:'ACCEPTED'},
    });

    const needsCompletion = await this.prisma.pickup.count({
      where: {status:'IN_PROGRESS'},
    });

    const revenue  = await this.prisma.pickup.aggregate({
      _sum: {estimatedEarning: true},
      where: {status:'ACCEPTED'},
    });

    return{
      perfectMatch,
      needsCompletion,
      potentialRevenue: revenue._sum.estimatedEarning?.toNumber() || 0,
    };

  }

  async acceptPickup(id: string){
  return this.prisma.pickup.updateMany({
    where:{
      pickupId: id,
      status:'PENDING',
    },
    data:{
      status: 'ACCEPTED',
    },
  });
}

 async cancelPickup(id: string) {
    return this.prisma.pickup.update({
      where: {pickupId: id},
      data: {status: 'CANCELLED'},
    });
  }
}


