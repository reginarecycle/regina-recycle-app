import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Auth } from '../common/decorator/auth.decorator';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @Auth()
  createMaterial(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.createMaterial(createMaterialDto);
  }

  @Get()
  @Auth()
  getAllMaterials(
   @Query('limit') limit?: string,
   @Query('offset') offset?: string,
   @Query('search') search?: string,
 ) {
    return this.materialsService.getAllMetarials (
     Number(limit) || 10,
     Number(offset) || 0,
     search,
);
  }

  @Get(':id')
  @Auth()
  getMaterialById(@Param('id') id: string) {
    return this.materialsService.getMaterialById(id);
  }

  @Patch(':id')
  @Auth()
  updateMaterial(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialsService.updateMaterial(id, updateMaterialDto);
  }

  @Delete(':id')
  @Auth()
  removeMaterial(@Param('id') id: string) {
    return this.materialsService.removeMaterial(id);
  }
}
