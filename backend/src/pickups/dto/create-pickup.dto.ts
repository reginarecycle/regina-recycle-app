// src/pickups/dto/create-pickup.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePickupItemDto {
  @ApiProperty({ example: 'uuid-of-material' })
  @IsString()
  @IsNotEmpty()
  materialId: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreatePickupDto {
  @ApiProperty({ example: 'uuid-of-address' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ example: '2026-04-01T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiProperty({ type: [CreatePickupItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePickupItemDto)
  items: CreatePickupItemDto[];
}