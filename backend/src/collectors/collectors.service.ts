import { Injectable , NotFoundException } from '@nestjs/common';
import { PickupStatus, PricingStatus } from '@prisma/client';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { BadRequestException } from '@nestjs/common';
import { ServiceFeeFactory } from '../materials/pricing/service-fee-factory';
import { CreateMaterialPricingDto} from './dto/create-material-pricing.dto';


@Injectable()
export class CollectorsService {
  constructor(private readonly prisma: PrismaService) {}
  private async ensureCollectorExists(collectorId: string) {
    const collector = await this.prisma.user.findFirst({
      where: {
        userId: collectorId,
        role: 'COLLECTOR',
      },
      select: { userId: true },
    });

    if (!collector) {
      throw new NotFoundException('Collector not found');
    }

    return collector;
  }

 async getStats( collectorId: string) {   // `This action returns stats for collector with ID: ${collectorId}`;
   await this.ensureCollectorExists(collectorId);
   const [pendingRequests, acceptedRequests, totalItems, pendingAmount] =
      await Promise.all([
        this.prisma.pickup.count({
          where: {
            collectorUserId: collectorId,
            status: PickupStatus.PENDING,
          },
        }),

        this.prisma.pickup.count({
          where: {
            collectorUserId: collectorId,
            status: PickupStatus.ACCEPTED,
          },
        }),

        this.prisma.pickupItem.aggregate({
          where: {
            pickup: {
              is: {
                collectorUserId: collectorId,
              },
            },
          },
          _sum: {
            quantity: true,
          },
        }),

        this.prisma.pickup.aggregate({
          where: {
            collectorUserId: collectorId,
            status: {
              in: [PickupStatus.PENDING, PickupStatus.ACCEPTED],
            },
          },
          _sum: {
            estimatedEarning: true,
          },
        }),
      ]);

    return {
      collectorId,
      pendingRequests,
      acceptedRequests,
      totalItems: totalItems._sum.quantity ?? 0,
      pendingAmount: Number(pendingAmount._sum.estimatedEarning ?? 0),
    };
    
  }

 async getMaterialDistribution(collectorId: string, period?: string) {  // `This action returns material distribution for collector with ID: ${collectorId} for period: ${period || 'all time'}`;
  await this.ensureCollectorExists(collectorId);
  const now = new Date();
    let startDate: Date | undefined;

    if (period === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    }

    const pickupItems = await this.prisma.pickupItem.findMany({
      where: {
        pickup: {
          is: {
            collectorUserId: collectorId,
            status: {
              in: [PickupStatus.ACCEPTED, PickupStatus.COMPLETED],
            },
            ...(startDate
              ? {
                  scheduledAt: {
                    gte: startDate,
                  },
                }
              : {}),
          },
        },
      },
      include: {
        material: true,
      },
    });

    const grouped = pickupItems.reduce(
      (acc, item) => {
        const key = item.materialId;

        if (!acc[key]) {
          acc[key] = {
            materialId: item.material.materialId,
            name: item.material.name,
            type: item.material.type,
            totalQuantity: 0,
          };
        }

        acc[key].totalQuantity += item.quantity;
        return acc;
      },
      {} as Record<
        string,
        {
          materialId: string;
          name: string;
          type: string;
          totalQuantity: number;
        }
      >,
    );

    return {
      collectorId,
      period: period || 'all',
      materials: Object.values(grouped),
    };
  }
  

  async getPickupOverview(collectorId: string) { // `This action returns pickup overview for collector with ID: ${collectorId}`;
    await this.ensureCollectorExists(collectorId);
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        status: {
          in: [PickupStatus.ACCEPTED, PickupStatus.COMPLETED],
        },
        scheduledAt: {
          gte: start,
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const overview = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const dayPickups = pickups.filter((pickup) => {
        const pickupDate = new Date(pickup.scheduledAt);

        return (
          pickupDate.getFullYear() === date.getFullYear() &&
          pickupDate.getMonth() === date.getMonth() &&
          pickupDate.getDate() === date.getDate()
        );
      });

      const units = dayPickups.reduce((sum, pickup) => {
        const pickupUnits = pickup.items.reduce(
          (itemSum, item) => itemSum + item.quantity,
          0,
        );

        return sum + pickupUnits;
      }, 0);

      return {
        day: dayNames[date.getDay()],
        units,
      };
    });

    return {
      collectorId,
      period: 'weekly',
      overview,
    };
  }
  

  async getPickups(collectorId: string, status?: string, limit?: number, offset: number = 0) { // `This action returns pickups for collector with ID: ${collectorId} with status: ${status || 'all'} limit: ${limit || 'no limit'} offset: ${offset || 0}`;
      await this.ensureCollectorExists(collectorId);

    const validStatus =
      status && Object.values(PickupStatus).includes(status as PickupStatus)
        ? (status as PickupStatus)
        : undefined;

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        ...(validStatus ? { status: validStatus } : {}),
      },
      include: {
        requester: {
          select: {
            userId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        address: true,
        items: {
          include: {
            material: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: limit,
      skip: offset,
    });

    return {
      collectorId,
      status: status || 'all',
      limit,
      offset,
      data: pickups,
    };
  }
  

  async getTopLocations(collectorId: string, limit?: number, period?: string) { // `This action returns top locations for collector with ID: ${collectorId} limit: ${limit || 'no limit'} period: ${period || 'all time'}`;
    await this.ensureCollectorExists(collectorId); 

    const now = new Date();
    let startDate: Date | undefined;

    if (period === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    }

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        status: {
          in: [PickupStatus.ACCEPTED, PickupStatus.COMPLETED],
        },
        ...(startDate
          ? {
              scheduledAt: {
                gte: startDate,
              },
            }
          : {}),
      },
      include: {
        address: true,
        items: true,
      },
    });

    const grouped = pickups.reduce(
      (acc, pickup) => {
        if (!pickup.address) return acc;

        const key = pickup.address.addressId;
        const units = pickup.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        if (!acc[key]) {
          acc[key] = {
            addressId: pickup.address.addressId,
            line1: pickup.address.line1,
            city: pickup.address.city,
            province: pickup.address.province,
            units: 0,
          };
        }

        acc[key].units += units;
        return acc;
      },
      {} as Record<
        string,
        {
          addressId: string;
          line1: string;
          city: string;
          province: string;
          units: number;
        }
      >,
    );

    return {
      collectorId,
      period: period || 'all',
      data: Object.values(grouped)
        .sort((a, b) => b.units - a.units)
        .slice(0, limit),
    };
  }
 

  async getCustomers(collectorId: string, search?:string, limit?: number, offset: number = 0) { // `This action returns customers for collector with ID: ${collectorId} limit: ${limit || 'no limit'} offset: ${offset || 0}`;
    await this.ensureCollectorExists(collectorId);

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        requesterUserId: { not: null },
        ...(search
          ? {
              requester: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
      },
      include: {
        requester: {
          select: {
            userId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        items: true,
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    const grouped = pickups.reduce(
      (acc, pickup) => {
        if (!pickup.requester) return acc;

        const key = pickup.requester.userId;

        const units = pickup.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        if (!acc[key]) {
          acc[key] = {
            customerId: pickup.requester.userId,
            name: pickup.requester.name,
            email: pickup.requester.email,
            phoneNumber: pickup.requester.phoneNumber,
            totalPickups: 0,
            totalUnits: 0,
          };
        }

        acc[key].totalPickups += 1;
        acc[key].totalUnits += units;

        return acc;
      },
      {} as Record<
        string,
        {
          customerId: string;
          name: string;
          email: string;
          phoneNumber: string | null;
          totalPickups: number;
          totalUnits: number;
        }
      >,
    );

    const customers = Object.values(grouped);

    return {
      collectorId,
      search: search || '',
      limit,
      offset,
      data: limit ? customers.slice(offset, offset + limit) : customers.slice(offset),
    };
  }
  

  async getCustomerDetails(collectorId: string, customerId: string) {   // `This action returns details for customer with ID: ${customerId} for collector with ID: ${collectorId}`;
    await this.ensureCollectorExists(collectorId);

    const customer = await this.prisma.user.findUnique({
      where: {
        userId: customerId,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phoneNumber: true,
        addresses: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        requesterUserId: customerId,
      },
      include: {
        address: true,
        items: {
          include: {
            material: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    return {
      collectorId,
      customer,
      pickups,
    };
  }
  

  async updateProfile(collectorId: string, updateCollectorDto: UpdateCollectorDto) {  // `This action updates the profile of collector with ID: ${collectorId}`;
    await this.ensureCollectorExists(collectorId);

    const updatedProfile = await this.prisma.collectorProfile.upsert({
      where: {
        userId: collectorId,
      },
      update: {
        ...(updateCollectorDto.licenseId !== undefined && {
          licenseId: updateCollectorDto.licenseId,
        }),
        ...(updateCollectorDto.serviceFee !== undefined && {
          serviceFee: updateCollectorDto.serviceFee,
        }),
        ...(updateCollectorDto.bulkIncentiveEnabled !== undefined && {
          bulkIncentiveEnabled: updateCollectorDto.bulkIncentiveEnabled,
        }),
        ...(updateCollectorDto.bulkThreshold !== undefined && {
          bulkThreshold: updateCollectorDto.bulkThreshold,
        }),
      },
      create: {
        userId: collectorId,
        licenseId: updateCollectorDto.licenseId ?? `LIC-${Date.now()}`,
        serviceFee: updateCollectorDto.serviceFee ?? 0,
        bulkIncentiveEnabled: updateCollectorDto.bulkIncentiveEnabled ?? false,
        bulkThreshold: updateCollectorDto.bulkThreshold ?? 100,
      },
    });

    return {
      message: 'Collector profile updated successfully',
      data: updatedProfile,
    };
  }
  

  async getPricing(collectorId: string, limit: number = 10, offset: number = 0, search?: string, status?: string,) { // `This action sets pricing for collector with ID: ${collectorId}, limit: ${limit}, offset: ${offset}, search: ${search || 'none'}, status: ${status || 'all'}`;
   await this.ensureCollectorExists(collectorId);

    const pricing = await this.prisma.collectorPricing.findMany({
      where: {
        collectorUserId: collectorId,
        ...(search
          ? {
              material: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
        ...(status ? { status: status as PricingStatus } : {}),
      },
      include: {
        material: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return {
      collectorId,
      limit,
      offset,
      search: search || '',
      status: status || 'all',
      data: pricing,
    };
  }

  async updateMaterialPricing(collectorId: string, materialId: string, dto: any) { // This action updates pricing for material with ID: ${materialId} for collector with ID: ${collectorId}, with data: ${JSON.stringify(dto)}`;
    await this.ensureCollectorExists(collectorId);

    const updatedPricing = await this.prisma.collectorPricing.update({
      where: {
        collectorUserId_materialId: {
          collectorUserId: collectorId,
          materialId,
        },
      },
      data: {
        ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
        ...(dto.bulkPrice !== undefined && { bulkPrice: dto.bulkPrice }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });

    return {
      message: 'Material pricing updated successfully',
      data: updatedPricing,
    };
  }
  

  async getMaterialSettings(collectorId: string) { // `This action returns settings for collector with ID: ${collectorId}`;
    await this.ensureCollectorExists(collectorId);

    const profile = await this.prisma.collectorProfile.findUnique({
      where: {
        userId: collectorId,
      },
      select: {
        bulkIncentiveEnabled: true,
        bulkThreshold: true,
        serviceFee: true,
      },
    });

    return {
      collectorId,
      settings: profile,
    };
  }
  

  async updateMaterialSettings(collectorId: string, dto: any) { // `This action updates settings for collector with ID: ${collectorId}, with data: ${JSON.stringify(dto)}`;
  
    await this.ensureCollectorExists(collectorId);

    const updatedSettings = await this.prisma.collectorProfile.update({
      where: {
        userId: collectorId,
      },
      data: {
        ...(dto.bulkIncentiveEnabled !== undefined && {
          bulkIncentiveEnabled: dto.bulkIncentiveEnabled,
        }),
        ...(dto.bulkThreshold !== undefined && {
          bulkThreshold: dto.bulkThreshold,
        }),
        ...(dto.serviceFee !== undefined && {
          serviceFee: dto.serviceFee,
        }),
      },
    });

    return {
      message: 'Material settings updated successfully',
      data: updatedSettings,
    };
  }
  

  async createMaterialPricing(
  collectorId: string,
  dto: CreateMaterialPricingDto,
) {
  await this.ensureCollectorExists(collectorId);

  return this.prisma.collectorPricing.create({
    data: {
      collectorUserId: collectorId,
      materialId: dto.materialId,
      basePrice: dto.basePrice,
      bulkPrice: dto.bulkPrice,
      status: dto.status ?? 'ACTIVE',
    },
  });
}


  calculateServiceFee(
  feeType: string,
  feeValue: number,
  collectorId: string,
  amount: number
): number {
  const serviceFee = ServiceFeeFactory.create(feeType, feeValue, collectorId);
  return serviceFee.calculate(amount);
}
}