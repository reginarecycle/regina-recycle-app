import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsNotEmpty,
    ValidateNested,
    IsString,
    IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethodDto } from "./paymentMethod.dto";

// this is only needed for the collector

export class AddFundsDto {
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    walletId!: string;

    // funds added
    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    fundsAdded!: number;

    // payment method (debit or credit or mobile payment)
    @ApiProperty({ type: PaymentMethodDto })
    @ValidateNested()
    @Type(() => PaymentMethodDto)
    @IsNotEmpty()
    paymentMethod!: PaymentMethodDto;
}