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

  @ApiProperty({ example: '123456789012' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Account number must contain digits only' })
  @MinLength(6)
  @MaxLength(17)
  accountNumber: string;

  @ApiProperty({ example: '021000021' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Routing number must contain digits only' })
  @MinLength(5)
  @MaxLength(9)
  routingNumber: string;

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