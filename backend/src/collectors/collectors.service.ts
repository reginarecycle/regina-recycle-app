import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PickupStatus, PricingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceFeeFactory } from '../materials/pricing/service-fee-factory';
import { UpdateCollectorDto } from './dto/update-collector.dto';
import { UpdateMaterialPricingDto } from './dto/update-material-pricing.dto';
import { UpdateMaterialSettingsDto } from './dto/update-material-settings.dto';
import { CreateMaterialPricingDto } from './dto/create-material-pricing.dto';
import { CollectorUsersQueryDto as CollectorQueryDto } from './dto/collectors-query.dto';
import { PickupQueryDto } from './dto/pickup-query.dto';
import { CollectorUsersQueryDto } from './dto/collectors-query.dto';
import { getPaginationParams, paginate } from '../common/pagination/pagination-helper';

@Injectable()
export class CollectorsService {
  constructor(private readonly prisma: PrismaService) { }

  private async ensureCollectorExists(collectorId: string) {
    const collector = await this.prisma.user.findFirst({
      where: { userId: collectorId, role: 'COLLECTOR' },
      select: { userId: true },
    });
    if (!collector) throw new NotFoundException('Collector not found');
    return collector;
  }

  async getStats(collectorId: string) {
    await this.ensureCollectorExists(collectorId);

    const [pendingRequests, acceptedRequests, totalItems, pendingAmount] = await Promise.all([
      this.prisma.pickup.count({ where: { collectorUserId: collectorId, status: PickupStatus.PENDING } }),
      this.prisma.pickup.count({ where: { collectorUserId: collectorId, status: PickupStatus.ACCEPTED } }),
      this.prisma.pickupItem.aggregate({
        where: { pickup: { is: { collectorUserId: collectorId } } },
        _sum: { quantity: true },
      }),
      this.prisma.pickup.aggregate({
        where: {
          collectorUserId: collectorId,
          status: { in: [PickupStatus.PENDING, PickupStatus.ACCEPTED] },
        },
        _sum: { estimatedEarning: true },
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

  async checkMaterialsAvailability(materialIds: string[]) {
    const unavailable: string[] = [];

    for (const materialId of materialIds) {
      const count = await this.prisma.collectorPricing.count({
        where: {
          materialId,
          status: 'ACTIVE',
        },
      });
      if (count === 0) unavailable.push(materialId);
    }

    return {
      available: unavailable.length === 0,
      unavailableMaterialIds: unavailable,
    };
  }

  async getMaterialDistribution(collectorId: string, period?: string) {
    await this.ensureCollectorExists(collectorId);

    const startDate = this.getStartDate(period);

    const pickupItems = await this.prisma.pickupItem.findMany({
      where: {
        pickup: {
          is: {
            collectorUserId: collectorId,
            status: { in: [PickupStatus.ACCEPTED, PickupStatus.COMPLETED] },
            ...(startDate ? { scheduledAt: { gte: startDate } } : {}),
          },
        },
      },
      include: { material: true },
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
      {} as Record<string, { materialId: string; name: string; type: string; totalQuantity: number }>,
    );

    return { collectorId, period: period || 'all', materials: Object.values(grouped) };
  }

  async getPickupOverview(collectorId: string) {
    await this.ensureCollectorExists(collectorId);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        status: { in: [PickupStatus.ACCEPTED, PickupStatus.COMPLETED] },
        scheduledAt: { gte: start },
      },
      include: { items: true },
      orderBy: { scheduledAt: 'asc' },
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const overview = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const units = pickups
        .filter((p) => {
          const d = new Date(p.scheduledAt);
          return (
            d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth() &&
            d.getDate() === date.getDate()
          );
        })
        .reduce((sum, p) => sum + p.items.reduce((s, item) => s + item.quantity, 0), 0);

      return { day: dayNames[date.getDay()], units };
    });

    return { collectorId, period: 'weekly', overview };
  }

  async getPickups(collectorId: string, query: PickupQueryDto) {
    await this.ensureCollectorExists(collectorId);

    const { page = 1, limit = 10, status } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const validStatus =
      status && Object.values(PickupStatus).includes(status as PickupStatus)
        ? (status as PickupStatus)
        : undefined;

    const where = {
      collectorUserId: collectorId,
      ...(validStatus ? { status: validStatus } : {}),
    };

    const [pickups, total] = await Promise.all([
      this.prisma.pickup.findMany({
        where,
        include: {
          requester: { select: { userId: true, name: true, email: true, phoneNumber: true } },
          address: true,
          items: { include: { material: true } },
          snapshots: {
            include: { material: true },
          },
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take,
      }),
      this.prisma.pickup.count({ where }),
    ]);

    return paginate(pickups, total, page, limit);
  }

  async getTopLocations(collectorId: string, limit?: number, period?: string) {
    await this.ensureCollectorExists(collectorId);

    const startDate = this.getStartDate(period);

    const pickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        status: { in: [PickupStatus.ACCEPTED, PickupStatus.COMPLETED] },
        ...(startDate ? { scheduledAt: { gte: startDate } } : {}),
      },
      include: { address: true, items: true },
    });

    const grouped = pickups.reduce(
      (acc, pickup) => {
        if (!pickup.address) return acc;
        const key = pickup.address.addressId;
        const units = pickup.items.reduce((sum, item) => sum + item.quantity, 0);
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
      {} as Record<string, { addressId: string; line1: string; city: string; province: string; units: number }>,
    );

    return {
      collectorId,
      period: period || 'all',
      data: Object.values(grouped).sort((a, b) => b.units - a.units).slice(0, limit),
    };
  }

  async getCustomers(collectorId: string, query: CollectorQueryDto) {
    await this.ensureCollectorExists(collectorId);

    const { page = 1, limit = 10, search } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where = {
      collectorUserId: collectorId,
      requesterUserId: { not: null as null },
      ...(search ? { requester: { name: { contains: search, mode: 'insensitive' as const } } } : {}),
    };

    const [pickups, total] = await Promise.all([
      this.prisma.pickup.findMany({
        where,
        include: {
          requester: { select: { userId: true, name: true, email: true, phoneNumber: true } },
          items: true,
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.pickup.count({ where }),
    ]);

    const customers = pickups.reduce(
      (acc, pickup) => {
        if (!pickup.requester) return acc;
        const key = pickup.requester.userId;
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
        acc[key].totalUnits += pickup.items.reduce((sum, item) => sum + item.quantity, 0);
        return acc;
      },
      {} as Record<string, { customerId: string; name: string; email: string; phoneNumber: string | null; totalPickups: number; totalUnits: number }>,
    );

    return paginate(Object.values(customers), total, page, limit);
  }

  async getCustomerDetails(collectorId: string, customerId: string) {
    await this.ensureCollectorExists(collectorId);

    const customer = await this.prisma.user.findUnique({
      where: { userId: customerId },
      select: { userId: true, name: true, email: true, phoneNumber: true, addresses: true },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const pickups = await this.prisma.pickup.findMany({
      where: { collectorUserId: collectorId, requesterUserId: customerId },
      include: { address: true, items: { include: { material: true } } },
      orderBy: { scheduledAt: 'desc' },
    });

    return { collectorId, customer, pickups };
  }

  // ─── NEW: Get Users Stats ──────────────────────────────────────────────────

  async getUsersStats(collectorId: string) {
    await this.ensureCollectorExists(collectorId);

    const totalUsers = await this.prisma.user.count({
      where: {
        role: 'CUSTOMER',
        pickupsRequested: {
          some: {
            collectorUserId: collectorId,
            status: PickupStatus.COMPLETED,
          },
        },
      },
    });

    const completedPickups = await this.prisma.pickup.findMany({
      where: {
        collectorUserId: collectorId,
        status: PickupStatus.COMPLETED,
      },
      select: { actualEarning: true },
    });

    const totalCollection = completedPickups.length;
    const totalRevenue = completedPickups.reduce(
      (sum, p) => sum + Number(p.actualEarning ?? 0),
      0,
    );

    return {
      totalUsers,
      avgRevenuePerUser: totalUsers > 0 ? totalRevenue / totalUsers : 0,
      totalCollection,
    };
  }

  async getUsers(collectorId: string, query: CollectorUsersQueryDto) {
    await this.ensureCollectorExists(collectorId);

    const { page = 1, limit = 10, keyword } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const userWhere: any = {
      role: 'CUSTOMER',
      pickupsRequested: {
        some: {
          collectorUserId: collectorId,
          status: PickupStatus.COMPLETED,
        },
      },
      ...(keyword && {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          { phoneNumber: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total, stats] = await Promise.all([
      this.prisma.user.findMany({
        where: userWhere,
        skip,
        take,
        select: {
          userId: true,
          name: true,
          email: true,
          phoneNumber: true,
          status: true,
          addresses: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { city: true },
          },
          pickupsRequested: {
            where: {
              collectorUserId: collectorId,
              status: PickupStatus.COMPLETED,
            },
            select: {
              actualEarning: true,
              items: {
                include: { material: true },
              },
            },
          },
        },
      }),
      this.prisma.user.count({ where: userWhere }),
      this.getUsersStats(collectorId),
    ]);

    const data = users.map((user) => {
      const completedPickups = user.pickupsRequested;
      const collections = completedPickups.length;
      const revenue = completedPickups.reduce(
        (sum, p) => sum + Number(p.actualEarning ?? 0),
        0,
      );
      const avgPerOrder = collections > 0 ? revenue / collections : 0;
      const collectedItems = [
        ...new Set(
          completedPickups.flatMap((p) =>
            p.items.map((i) => i.material.type),
          ),
        ),
      ];

      return {
        customerId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        neighborhood: user.addresses[0]?.city ?? '',
        status: user.status,
        collections,
        revenue,
        avgPerOrder,
        collectedItems,
      };
    });

    return {
      stats,
      ...paginate(data, total, page, limit),
    };
  }

  async updateProfile(collectorId: string, dto: UpdateCollectorDto) {
    await this.ensureCollectorExists(collectorId);

    const updatedProfile = await this.prisma.collectorProfile.upsert({
      where: { userId: collectorId },
      update: {
        ...(dto.licenseId !== undefined && { licenseId: dto.licenseId }),
        ...(dto.serviceFee !== undefined && { serviceFee: dto.serviceFee }),
        ...(dto.feeType !== undefined && { feeType: dto.feeType }),
        ...(dto.bulkIncentiveEnabled !== undefined && { bulkIncentiveEnabled: dto.bulkIncentiveEnabled }),
        ...(dto.bulkThreshold !== undefined && { bulkThreshold: dto.bulkThreshold }),
      },
      create: {
        userId: collectorId,
        licenseId: dto.licenseId ?? `LIC-${Date.now()}`,
        serviceFee: dto.serviceFee ?? 0,
        feeType: dto.feeType ?? 'FLAT_FEE',
        bulkIncentiveEnabled: dto.bulkIncentiveEnabled ?? false,
        bulkThreshold: dto.bulkThreshold ?? 100,
      },
    });

    return { message: 'Collector profile updated successfully', data: updatedProfile };
  }

  async getPricing(collectorId: string, query: CollectorQueryDto) {
    await this.ensureCollectorExists(collectorId);

    const { page = 1, limit = 10, search, status } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const materialWhere = {
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    // Fetch all platform materials (paginated) + this collector's pricing in parallel
    const [materials, total, pricings] = await Promise.all([
      this.prisma.material.findMany({
        where: materialWhere,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: { materialId: true, name: true, type: true, photoUrl: true },
      }),
      this.prisma.material.count({ where: materialWhere }),
      this.prisma.collectorPricing.findMany({
        where: { collectorUserId: collectorId },
      }),
    ]);

    const pricingMap = new Map(pricings.map((p) => [p.materialId, p]));

    // Merge: every material gets the collector's real price (or 0/INACTIVE if not set)
    const merged = materials.map((material) => {
      const p = pricingMap.get(material.materialId);
      return {
        collectorPricingId: p?.collectorPricingId ?? null,
        collectorUserId:    collectorId,
        materialId:         material.materialId,
        basePrice:          p ? Number(p.basePrice) : 0,
        bulkPrice:          p?.bulkPrice ? Number(p.bulkPrice) : 0,
        status:             p?.status ?? 'INACTIVE',
        createdAt:          p?.createdAt ?? new Date(),
        updatedAt:          p?.updatedAt ?? new Date(),
        material: {
          materialId: material.materialId,
          name:       material.name,
          type:       material.type,
          photoUrl:   material.photoUrl ?? null,
        },
      };
    });

    // Apply optional status filter after merging
    const filtered = status ? merged.filter((r) => r.status === status) : merged;

    return paginate(filtered, status ? filtered.length : total, page, limit);
  }

  async createMaterialPricing(collectorId: string, dto: CreateMaterialPricingDto) {
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

  async updateMaterialPricing(collectorId: string, materialId: string, dto: UpdateMaterialPricingDto) {
    await this.ensureCollectorExists(collectorId);

    const updated = await this.prisma.collectorPricing.update({
      where: { collectorUserId_materialId: { collectorUserId: collectorId, materialId } },
      data: {
        ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
        ...(dto.bulkPrice !== undefined && { bulkPrice: dto.bulkPrice }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });

    return { message: 'Material pricing updated successfully', data: updated };
  }

  async getMaterialSettings(collectorId: string) {
    await this.ensureCollectorExists(collectorId);

    const profile = await this.prisma.collectorProfile.findUnique({
      where: { userId: collectorId },
      select: { bulkIncentiveEnabled: true, bulkThreshold: true, serviceFee: true, feeType: true },
    });

    return {
      settings: profile
        ? { ...profile, serviceFee: Number(profile.serviceFee) }
        : null,
    };
  }

  async updateMaterialSettings(collectorId: string, dto: UpdateMaterialSettingsDto) {
    await this.ensureCollectorExists(collectorId);

    const updated = await this.prisma.collectorProfile.update({
      where: { userId: collectorId },
      data: {
        ...(dto.bulkIncentiveEnabled !== undefined && { bulkIncentiveEnabled: dto.bulkIncentiveEnabled }),
        ...(dto.bulkThreshold !== undefined && { bulkThreshold: dto.bulkThreshold }),
        ...(dto.serviceFee !== undefined && { serviceFee: dto.serviceFee }),
        ...(dto.feeType !== undefined && { feeType: dto.feeType }),
      },
    });

    return { message: 'Material settings updated successfully', data: updated };
  }

  async calculateMaterialPayout(collectorId: string, materialId: string, quantity: number) {
    await this.ensureCollectorExists(collectorId);

    const [collectorPricing, profile] = await Promise.all([
      this.prisma.collectorPricing.findUnique({
        where: { collectorUserId_materialId: { collectorUserId: collectorId, materialId } },
        include: { material: true },
      }),
      this.prisma.collectorProfile.findUnique({
        where: { userId: collectorId },
        select: { serviceFee: true, feeType: true },
      }),
    ]);

    if (!collectorPricing) {
      throw new BadRequestException('Collector pricing not found for this material');
    }

    const unitPrice = Number(collectorPricing.basePrice ?? 0);
    const grossPayout = quantity * unitPrice;
    const feeType = profile?.feeType ?? 'FLAT_FEE';
    const feeValue = Number(profile?.serviceFee ?? 0);
    const serviceFee = this.calculateServiceFee(feeType, feeValue, grossPayout);
    const netPayout = Math.max(0, grossPayout - serviceFee);

    return {
      collectorId,
      materialId,
      materialName: collectorPricing.material.name,
      quantity,
      unitPrice,
      grossPayout,
      feeType,
      serviceFee,
      netPayout,
    };
  }

  calculateServiceFee(feeType: string, feeValue: number, amount: number): number {
    return ServiceFeeFactory.create(feeType, feeValue).calculate(amount);
  }

  async getAverageMaterialPrice(materialId: string) {
    const result = await this.prisma.collectorPricing.aggregate({
      where: {
        materialId,
        status: PricingStatus.ACTIVE,
      },
      _min: {
        basePrice: true,
      },
      _max: {
        basePrice: true,
      },
      _avg: {
        basePrice: true,
      },
    });


    return {
      minPrice: Number(result._min.basePrice ?? 0),
      maxPrice: Number(result._max.basePrice ?? 0),
      avgPrice: Number(result._avg.basePrice ?? 0),
    };
  }

  private getStartDate(period?: string): Date | undefined {
    if (!period) return undefined;
    const date = new Date();
    if (period === 'weekly') date.setDate(date.getDate() - 7);
    else if (period === 'monthly') date.setDate(date.getDate() - 30);
    else return undefined;
    return date;
  }
}

