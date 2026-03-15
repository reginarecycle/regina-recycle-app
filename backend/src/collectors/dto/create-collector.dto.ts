import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCollectorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  licenseId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  serviceFee?: number;

  @IsOptional()
  @IsBoolean()
  bulkIncentiveEnabled?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkThreshold?: number;
}
