// src/pickups/dto/update-pickup.dto.ts
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PickupStatus } from '@prisma/client';

export class UpdatePickupDto {
  @ApiPropertyOptional({ example: '2026-04-01T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({ enum: PickupStatus })
  @IsEnum(PickupStatus)
  @IsOptional()
  status?: PickupStatus;
}