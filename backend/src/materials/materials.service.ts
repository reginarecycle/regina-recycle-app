import { Injectable } from '@nestjs/common';
import {PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {

  constructor(private prisma: PrismaService) {}


  createMaterial(createMaterialDto: CreateMaterialDto) {
    return 'This action creates a new material';
  }

  async getMaterials(page = 1, limit = 10, search?: string) {

    const skip = (page -1) * limit;
    return this.prisma.material.findMany({
      where: search
      ? {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
      :undefined,
      skip,
      take: limit,
    });
  }

  
  async getMaterialById(id: string) {
    return this.prisma.material.findUnique({
      where: { 
        materialId: id ,
      },
    });
  }

  updateMaterial(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  deleteMaterial(id: number) {
    return `This action removes a #${id} material`;
  }
}
