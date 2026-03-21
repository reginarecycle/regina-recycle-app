import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TxType, TxStatus } from '@prisma/client';
import { PaginationDto } from '../../common/pagination/pagination.dto';

export class WalletTransactionQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'Payment for tins' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: TxType, example: TxType.CREDIT })
  @IsEnum(TxType)
  @IsOptional()
  type?: TxType;

  @ApiPropertyOptional({ enum: TxStatus, example: TxStatus.COMPLETED })
  @IsEnum(TxStatus)
  @IsOptional()
  status?: TxStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'ISO date string',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date' })
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'ISO date string',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date' })
  endDate?: string;
}