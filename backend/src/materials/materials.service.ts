import { Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  createMaterial(createMaterialDto: CreateMaterialDto) {
    return 'This action creates a new material';
  }

  getMaterials() {
    return `This action returns all materials`;
  }

  getMaterialById(id: number) {
    return `This action returns a #${id} material`;
  }

  updateMaterial(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  deleteMaterial(id: number) {
    return `This action removes a #${id} material`;
  }
}
