import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, getPaginationParams } from '../common/pagination/pagination-helper';

@Injectable()
export class MaterialsService {
   constructor(private readonly prisma: PrismaService) {} 

  async createMaterial(createMaterialDto: CreateMaterialDto) {

  const existingMaterial = await this.prisma.material.findUnique({
    where: { name: createMaterialDto.name }
  });

  if (existingMaterial) {
    return existingMaterial;
  }

  return this.prisma.material.create({
    data: {
      name: createMaterialDto.name,
      type: createMaterialDto.type,
      photoUrl: createMaterialDto.photoUrl,
      co2Saved: createMaterialDto.co2Saved,
      waterSaved: createMaterialDto.waterSaved,
    },
  });
}
 

  async getAllMaterials(page = 1, limit = 10, search?: string) {
  const where = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  const { skip, take } = getPaginationParams(page, limit);

  const [data, total] = await Promise.all([
    this.prisma.material.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    }),
    this.prisma.material.count({
      where,
    }),
  ]);

  return paginate(data, total, page, limit);
}
  

  async getMaterialById(id: string) {  
   const material = await this.prisma.material.findUnique({
      where: { materialId: id },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return material;
  }

  async updateMaterial(id: string, updateMaterialDto: UpdateMaterialDto) { 
    await this.getMaterialById(id);
    return this.prisma.material.update({
      where: { materialId: id },
      data: {
        name: updateMaterialDto.name,
        type: updateMaterialDto.type,
        photoUrl: updateMaterialDto.photoUrl,
        co2Saved: updateMaterialDto.co2Saved,
        waterSaved: updateMaterialDto.waterSaved,
      },
    }); 
  }

  async removeMaterial(id: string) {  
   await this.getMaterialById(id);

    return this.prisma.material.delete({
      where: { materialId: id },
    });
  } 
  }

