import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  createMaterial(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.createMaterial(createMaterialDto);
  }

  @Get()
  getMaterials() {
    return this.materialsService.getMaterials();
  }

  @Get(':id')
  getMaterialById(@Param('id') id: string) {
    return this.materialsService.getMaterialById(+id);
  }

  @Patch(':id')
  updateMaterial(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialsService.updateMaterial(+id, updateMaterialDto);
  }

  @Delete(':id')
  deleteMaterial(@Param('id') id: string) {
    return this.materialsService.deleteMaterial(+id);
  }
}
