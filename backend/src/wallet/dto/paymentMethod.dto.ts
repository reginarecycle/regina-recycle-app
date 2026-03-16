import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNotEmpty, IsOptional,
    IsString, IsInt, Min, Max,
    IsEnum, Matches,
    IsBoolean
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethodType } from "@prisma/client";

export class PaymentMethodDto {
    //     paymentMethodId String            @id @default(uuid())
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    paymentMethodId: string;

    //   userId          String
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    //   type            PaymentMethodType
    @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.CARD })
    @IsEnum(PaymentMethodType)
    @IsNotEmpty()
    type!: PaymentMethodType;

    //   cardLast4       String?
    @ApiPropertyOptional({ example: '0000' })
    @IsString()
    @IsNotEmpty()
    cardLast4?: string;

    //   cardBrand       String?
    @ApiPropertyOptional({ example: 'Visa' })
    @IsString()
    @IsNotEmpty()
    cardBrand?: string;

    //   expMonth        Int?
    @ApiPropertyOptional({ example: 12 })
    @IsInt()
    @Min(1)
    @Max(12)
    @IsOptional()
    expMonth?: number;

    //   expYear         Int?
    @ApiPropertyOptional({ example: 2030 })
    @IsInt()
    @Min(2000)
    @Max(2040)
    @IsOptional()
    expYear?: number;

    //   mobileProvider  String?
    @ApiPropertyOptional({ example: 'Apple' })
    @IsString()
    @IsOptional()
    mobileProvider?: string;

    //   phoneNumber     String?
    @ApiPropertyOptional({ example: '306 231 7863' })
    // check for multiple formats of the phone number
    @Matches(/^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/, {
        message: "Invalid phone number format",
    })
    @IsOptional()
    phoneNumber?: string;

    //   isDefault       Boolean  @default(false)
    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}
