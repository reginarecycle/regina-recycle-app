import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCollectorDto } from './dto/update-collector.dto';

@Injectable()
export class CollectorsService {
  constructor (private prisma: PrismaService) {}

  async getStats( collectorUserId: string) {
    const total = await this.prisma.pickup.count({
      where: {collectorUserId},
    });

    const completed = await this.prisma.pickup.count({
      where:{
        collectorUserId,
        status: 'COMPLETED',
      },
    });
  
    const pending = await this.prisma.pickup.count({
      where:{
        collectorUserId,
        status: 'PENDING',
      },
    });

    const inProgress = await this.prisma.pickup.count({
      where:{
        collectorUserId,
        status: 'IN_PROGRESS',
      },
    });

    const cancelled = await this.prisma.pickup.count({
      where:{
        collectorUserId,
        status: 'CANCELLED',
      },
    });

    return {
      total, 
      completed,
      pending,
      inProgress,
      cancelled,
    };
    }

  getMaterialDistribution(collectorId: string, period?: string) {
    return `This action returns material distribution for collector with ID: ${collectorId} for period: ${period || 'all time'}`;
  }

  getPickupOverview(collectorId: string) {
    return `This action returns pickup overview for collector with ID: ${collectorId}`;
  }

  getPickups(collectorId: string, status?: string, limit?: number, offset?: number) {
    return `This action returns pickups for collector with ID: ${collectorId} with status: ${status || 'all'} limit: ${limit || 'no limit'} offset: ${offset || 0}`;
  }

  getTopLocations(collectorId: string, limit?: number, period?: string) {
    return `This action returns top locations for collector with ID: ${collectorId} limit: ${limit || 'no limit'} period: ${period || 'all time'}`;
  }

  getCustomers(collectorId: string, search?:string, limit?: number, offset?: number) {
    return `This action returns customers for collector with ID: ${collectorId} limit: ${limit || 'no limit'} offset: ${offset || 0}`;
  }

  getCustomerDetails(collectorId: string, customerId: string) {
    return `This action returns details for customer with ID: ${customerId} for collector with ID: ${collectorId}`;
  }

  updateProfile(collectorId: string, updateCollectorDto: UpdateCollectorDto) {
    return `This action updates the profile of collector with ID: ${collectorId}`;
  }

  getPricing(collectorId: string,
    limit: number = 10,
    offset: number = 0,
    search?: string,
    status?: string,) {
    return `This action sets pricing for collector with ID: ${collectorId}, limit: ${limit}, offset: ${offset}, search: ${search || 'none'}, status: ${status || 'all'}`;
  }

  updateMaterialPricing(collectorId: string, materialId: string, dto: any) {
    return `This action updates pricing for material with ID: ${materialId} for collector with ID: ${collectorId}, with data: ${JSON.stringify(dto)}`;
  }

  getMaterialSettings(collectorId: string) {
    return `This action returns settings for collector with ID: ${collectorId}`;
  }

  updateMaterialSettings(collectorId: string, dto: any) {
    return `This action updates settings for collector with ID: ${collectorId}, with data: ${JSON.stringify(dto)}`;
  }
}
