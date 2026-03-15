import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingStatus } from '@prisma/client';

export class UpdateMaterialPricingDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkPrice?: number;

  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;
}
