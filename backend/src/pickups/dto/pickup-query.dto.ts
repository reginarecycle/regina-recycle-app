import { IsOptional, IsString, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/pagination/pagination.dto';

export enum PickupStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class PickupQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'Regina' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PickupStatus })
  @IsOptional()
  @IsEnum(PickupStatus)
  status?: PickupStatus;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsOptional()
  @IsBoolean()
  isCompatible?: boolean;

}