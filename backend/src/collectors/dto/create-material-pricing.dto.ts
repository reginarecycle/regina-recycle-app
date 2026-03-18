​import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingStatus } from '@prisma/client';

export class CreateMaterialPricingDto {
  @IsString()
  materialId: string;

  @Type(() => Number)
  @IsNumber()
  basePrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkPrice?: number;

  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;
}
