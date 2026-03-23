​import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMaterialPricingDto {
  @ApiProperty({ example: 'material-uuid' })
  @IsString()
  materialId: string;
  
 @ApiProperty({ example: 10.5 })
  @Type(() => Number)
  @IsNumber()
  basePrice: number;

   @ApiPropertyOptional({ example: 8.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkPrice?: number;

  @ApiPropertyOptional({ enum: PricingStatus, example: 'ACTIVE' })
  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;
}
