import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMaterialSettingsDto {
 @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  bulkIncentiveEnabled?: boolean;

 @ApiPropertyOptional({ example: 100})
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkThreshold?: number;


  @ApiPropertyOptional({ example: 5.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  serviceFee?: number;

  @ApiPropertyOptional({ enum: ['FLAT_FEE', 'PERCENTAGE_FEE'] })
  @IsOptional()
  @IsString()
  feeType?: string;
}
