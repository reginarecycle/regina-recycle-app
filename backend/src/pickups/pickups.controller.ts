// src/pickups/pickups.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PickupsService } from './pickups.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pickups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  // USER: Schedule a pickup
  @ApiOperation({ summary: 'Schedule a pickup' })
  @Post()
  create(@Request() req, @Body() createPickupDto: CreatePickupDto) {
    return this.pickupsService.create(req.user.userId, createPickupDto);
  }

  // USER: Get their own pickups
  @ApiOperation({ summary: 'Get all pickups for logged in user' })
  @Get()
  findAll(@Request() req) {
    return this.pickupsService.findAll(req.user.userId);
  }

  // COLLECTOR: Get all PENDING requests
  @ApiOperation({ summary: 'Get all pending pickup requests (collector)' })
  @Get('requests')
  getRequests() {
    return this.pickupsService.getRequests();
  }

  // Get a single pickup by ID
  @ApiOperation({ summary: 'Get a pickup by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pickupsService.findOne(id);
  }

  // COLLECTOR: Accept a pickup
  @ApiOperation({ summary: 'Accept a pickup (collector)' })
  @Patch(':id/accept')
  accept(@Param('id') id: string, @Request() req) {
    return this.pickupsService.accept(id, req.user.userId);
  }

  // Update a pickup
  @ApiOperation({ summary: 'Update a pickup' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePickupDto: UpdatePickupDto) {
    return this.pickupsService.update(id, updatePickupDto);
  }

  // Cancel a pickup
  @ApiOperation({ summary: 'Cancel a pickup' })
  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.pickupsService.cancel(id);
  }
}