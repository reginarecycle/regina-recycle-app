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
import { PickupsService } from './pickups.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // all routes require a logged-in user
@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  // USER: Schedule a pickup
  // POST /pickups
  @Post()
  create(@Request() req, @Body() createPickupDto: CreatePickupDto) {
    return this.pickupsService.create(req.user.userId, createPickupDto);
  }

  // COLLECTOR: See all pending pickups
  // GET /pickups
  @Get()
  findAll() {
    return this.pickupsService.findAll();
  }

  // COLLECTOR: Accept a pickup
  // PATCH /pickups/:id/accept
  @Patch(':id/accept')
  accept(@Param('id') id: string, @Request() req) {
    return this.pickupsService.accept(id, req.user.userId);
  }

  // COLLECTOR: Update a pickup (correct materials/qty)
  // PATCH /pickups/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePickupDto: UpdatePickupDto) {
    return this.pickupsService.update(id, updatePickupDto);
  }

  // Cancel a pickup
  // DELETE /pickups/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pickupsService.remove(id);
  }
}