import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor (private prisma: PrismaService){}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where:{userId},
      include:{
        addresses: true,
        notificationPrefs: true,
        wallet: true,
        customerDOB: true

      }
    });
  }

  async getUserByEmail (email: string){
    return this.prisma.user.findUnique({
      where: {email}
    });
  }
  async getUserAddresses (userId: string){
    return this.prisma.address.findMany({
      where: {userId}
    });
  }

  async getNotificationPreferences(userId: string){
    return this.prisma.notificationPreference.findUnique({
      where: {userId}
    });
  }

  async updateNotificationPreferences(userId: string, data: any){
    return this.prisma.notificationPreference.update({
      where: {userId},
      data
    });
  }

    async getUserBasicInfo(userId: string){
      return this.prisma.user.findUnique({
        where:{userId},
        select:{
          userId: true,
          name: true,
          email: true
        }
      });
    }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {userId},
      data: updateUserDto
    });
  }

  async deactivateAccount(userId: string) {
    return this.prisma.user.update({
      where: {userId},
      data: {
        status: 'INACTIVE'
      }
    });
  }

  async deleteAccount(userId: string) {
    return this.prisma.user.update({
      where: {userId},
      data: {
        deletedAt: new Date ()
      }
    });
  }
}
 