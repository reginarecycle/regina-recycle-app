import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsNumber,
  IsInt,
  IsPositive,
  ValidateNested,
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

export class PickupAddressDto {
  @ApiProperty({ example: '456 Victoria Ave' })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiProperty({ example: 'Suite 12' })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ example: 'Regina' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Saskatchewan' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: 'S4N 0P1' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 50.4452 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -104.6189 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class CreatePickupDto {
  @ApiProperty({ type: PickupAddressDto })
  @ValidateNested()
  @Type(() => PickupAddressDto)
  @IsNotEmpty()
  address: PickupAddressDto;

  @ApiProperty({ example: '2026-04-01T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiProperty({ example: 25.50, required: false })
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiProperty({ example: 'Please handle with care, glass items included', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: [CreatePickupItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePickupItemDto)
  items: CreatePickupItemDto[];
}