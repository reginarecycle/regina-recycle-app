import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TxStatus } from '@prisma/client';

export class CollectorWithdrawFundsDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({ example: 'TD Bank' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: '1234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7}$/, { message: 'Account number must be exactly 7 digits' })
  accountNumber: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}$/, { message: 'Transit number must be exactly 5 digits' })
  routingNumber: string;

  @ApiProperty({ example: '001' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}$/, { message: 'Institution number must be exactly 3 digits' })
  institutionNumber: string;

  @ApiProperty({ example: 150.75 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ enum: TxStatus, example: TxStatus.PENDING })
  @IsEnum(TxStatus)
  @IsOptional()
  status?: TxStatus;
}