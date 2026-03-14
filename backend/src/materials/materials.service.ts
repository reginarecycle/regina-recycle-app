import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class MaterialsService {
   constructor(private readonly prisma: PrismaService) {} 

  async create(createMaterialDto: CreateMaterialDto) {  // creates a new materal 
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
 

  async findAll() {    // returns all material 
  return this.prisma.material.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}   
  

  async findOne(id: string) {  // return one material 
   const material = await this.prisma.material.findUnique({
      where: { materialId: id },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) { // this function update one material 
    await this.findOne(id);
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

  async remove(id: string) {  // this function deletes material 
    return await this.findOne(id);

    return this.prisma.material.delete({
      where: { materialId: id },
    });
  } 
  }

