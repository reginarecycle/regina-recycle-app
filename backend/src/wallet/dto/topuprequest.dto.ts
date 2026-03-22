import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TxStatus, PaymentMethodType } from '@prisma/client';

export class TopUpRequestsDto {
  @ApiProperty({ example: 100.00 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.CARD })
  @IsEnum(PaymentMethodType)
  @IsNotEmpty()
  paymentType: PaymentMethodType;

  // ── Card fields ──────────────────────────────────────────────────────────
  @ApiPropertyOptional({ example: '4242' })
  @ValidateIf((o) => o.paymentType === PaymentMethodType.CARD)
  @IsString()
  @Matches(/^\d{4}$/, { message: 'cardLast4 must be exactly 4 digits' })
  @IsNotEmpty()
  cardLast4?: string;

  @ApiPropertyOptional({ example: 'Visa' })
  @ValidateIf((o) => o.paymentType === PaymentMethodType.CARD)
  @IsString()
  @IsNotEmpty()
  cardBrand?: string;

  @ApiPropertyOptional({ example: 12 })
  @ValidateIf((o) => o.paymentType === PaymentMethodType.CARD)
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  expMonth?: number;

  @ApiPropertyOptional({ example: 2030 })
  @ValidateIf((o) => o.paymentType === PaymentMethodType.CARD)
  @IsInt()
  @Min(2025)
  @Max(2060)
  @IsNotEmpty()
  expYear?: number;

  @ApiPropertyOptional({ example: 'Apple Pay' })
  @ValidateIf((o) => o.paymentType === PaymentMethodType.MOBILE_PAYMENT)
  @IsString()
  @IsNotEmpty()
  mobileProvider?: string;

  @ApiPropertyOptional({ enum: TxStatus, example: TxStatus.PENDING })
  @IsEnum(TxStatus)
  @IsOptional()
  status?: TxStatus;
}