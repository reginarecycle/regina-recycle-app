import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePickupDto {
  @ApiPropertyOptional({ example: '2026-04-01T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({ example: 30.00 })
  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @ApiPropertyOptional({ example: 'Updated note: added more items' })
  @IsString()
  @IsOptional()
  note?: string;
}