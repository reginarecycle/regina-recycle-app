import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectorDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  licenseId?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  serviceFee?: number;

  @ApiProperty({ enum: ['FLAT_FEE', 'PERCENTAGE_FEE'], default: 'FLAT_FEE' })
  @IsOptional()
  @IsString()
  feeType?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  bulkIncentiveEnabled?: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bulkThreshold?: number;
}
