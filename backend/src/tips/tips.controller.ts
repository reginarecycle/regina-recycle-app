import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  // Public: random active tip of the day
  @Get()
  getTips() {
    return this.tipsService.getTips();
  }

  // Public: get all tips (with optional ?active=true/false filter)
  @Get('all')
  findAll(@Query('active') active?: string) {
    const activeOnly =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return this.tipsService.findAll(activeOnly);
  }

  // Public: get a specific tip by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipsService.findOne(id);
  }

  // Protected: create a tip
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTipDto: CreateTipDto) {
    return this.tipsService.create(createTipDto);
  }

  // Protected: update a tip
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTipDto: UpdateTipDto) {
    return this.tipsService.update(id, updateTipDto);
  }

  // Protected: toggle active/inactive
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string) {
    return this.tipsService.toggleActive(id);
  }

  // Protected: delete a tip
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tipsService.remove(id);
  }
}