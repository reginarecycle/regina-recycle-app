import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TxStatus } from '@prisma/client';

export class CustomerWithdrawFundsDto {
  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail({}, { message: 'interacEmail must be a valid email address' })
  @IsNotEmpty()
  interacEmail: string;

  @ApiPropertyOptional({ example: 'What is your favourite colour?' })
  @IsString()
  @IsOptional()
  securityQuestion?: string;

  @ApiPropertyOptional({ example: 'Green' })
  @IsString()
  @IsOptional()
  securityAnswer?: string;

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