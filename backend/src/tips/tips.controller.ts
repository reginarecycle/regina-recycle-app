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
  getRandomActiveTip() {
    return this.tipsService.getRandomActiveTip();
  }

  // Public: get all tips (with optional ?active=true/false filter)
  @Get('all')
  getAllTips(@Query('active') active?: string) {
    const activeOnly =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return this.tipsService.getAllTips(activeOnly);
  }

  // Public: get a specific tip by ID
  @Get(':id')
  getTipById(@Param('id') id: string) {
    return this.tipsService.getTipById(id);
  }

  // Protected: create a tip
  @Post()
  @UseGuards(JwtAuthGuard)
  createTip(@Body() createTipDto: CreateTipDto) {
    return this.tipsService.createTip(createTipDto);
  }

  // Protected: update a tip
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTip(@Param('id') id: string, @Body() updateTipDto: UpdateTipDto) {
    return this.tipsService.updateTip(id, updateTipDto);
  }

  // Protected: toggle active/inactive
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleTipActiveStatus(@Param('id') id: string) {
    return this.tipsService.toggleTipActiveStatus(id);
  }

  // Protected: delete a tip
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTip(@Param('id') id: string) {
    return this.tipsService.deleteTip(id);
  }
}