import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  Matches,
  IsBoolean,
} from 'class-validator';
import { PaymentMethodType } from '@prisma/client';

export class PaymentMethodDto {
  @ApiProperty({ example: 'cm9abc123' })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.CARD })
  @IsEnum(PaymentMethodType)
  @IsNotEmpty()
  type: PaymentMethodType;

  @ApiPropertyOptional({ example: '4242' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'cardLast4 must be exactly 4 digits' })
  @IsOptional()
  cardLast4?: string;

  @ApiPropertyOptional({ example: 'Visa' })
  @IsString()
  @IsOptional()
  cardBrand?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  expMonth?: number;

  @ApiPropertyOptional({ example: 2030 })
  @IsInt()
  @Min(2000)
  @Max(2060)
  @IsOptional()
  expYear?: number;

  @ApiPropertyOptional({ example: 'Apple Pay' })
  @IsString()
  @IsOptional()
  mobileProvider?: string;

  @ApiPropertyOptional({ example: '306-231-7863' })
  @Matches(/^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/, {
    message: 'phoneNumber must be a valid format e.g. 306-231-7863',
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}