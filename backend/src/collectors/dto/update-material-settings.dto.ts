import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMaterialSettingsDto {
  @IsOptional()
  @IsBoolean()
  bulkIncentiveEnabled?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkThreshold?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  serviceFee?: number;
}
