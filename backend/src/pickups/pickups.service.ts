import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { Injectable } from '@nestjs/common';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';

@Injectable()
export class PickupsService {

  constructor (
    private prisma: PrismaService,
    private walletService: WalletService,

  ){}

  create(createPickupDto: CreatePickupDto) {
    return this.prisma.pickup.create({
      data: {
        date: new Date(createPickupDto.date),
        status: createPickupDto.status,
        user: {
          connect: {id: createPickupDto.userId},
        },
      },
    });
  }

  findAll() {
    return this.prisma.pickup.findMany();
  }

  findOne(id: number) {
    return this.prisma.pickup.findUnique({
      where:{id},
    });
  }

  update(id: number, updatePickupDto: UpdatePickupDto) {
    return this.prisma.pickup.update({
      where:{id},
      data: updatePickupDto,
    });
  }

  remove(id: number) {
      return this.prisma.pickup.delete({
      where: {id},
      });
  }

  async completePickup(pickupId: number){
    const pickup = await this.prisma.pickup.update({
      where: {id: pickupId},
      data: {status: 'COMPLETED'},

    });

    const calcAmnt = 30;
    await this.walletService.creditUser(pickup.userId, calcAmnt);
     
    return pickup;

  }
}
