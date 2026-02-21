import { Controller, Get, Param } from '@nestjs/common';
import { MaterialsService } from './materials.service';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  getAll() {
    return this.materialsService.getAll();
  }

  @Get('collector/:collectorId')
  getByCollector(@Param('collectorId') collectorId: string) {
    return this.materialsService.getByCollector(collectorId);
  }
}
