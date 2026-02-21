import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.material.findMany();
  }

  async getByCollector(collectorId: string) {
    return this.prisma.collectorPricing.findMany({
      where: { collectorUserId: collectorId },
      include: {
        material: true,
      },
    });
  }
}
