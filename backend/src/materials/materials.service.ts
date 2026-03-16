import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class MaterialsService {
   constructor(private readonly prisma: PrismaService) {} 

  async createMaterial(createMaterialDto: CreateMaterialDto) {  
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
 

  async getAllMetarials(limit = 10, offset = 0, search?: string) {
  return this.prisma.material.findMany({
    where: search
       ? {
          name: { contains: search, mode: 'insensitive' },
         }
       : {},
     orderBy: {
       createdAt: 'desc',
     },
     take: limit,
     skip: offset,
   });

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

