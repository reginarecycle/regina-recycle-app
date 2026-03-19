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
import { TxStatus } from "@prisma/client";
import { PaymentMethodDto } from "./paymentMethod.dto";

// this is only needed for the collector

export class TopUpRequestsDto {
    // removed since the user's id will used automatically
    // @ApiProperty({ example: 'cm9abc123' })
    // @IsString()
    // @IsNotEmpty()
    // userId: string;

    // removed due to repitition -> this field is already implemented in the payment method dto
    // @ApiProperty({ example: 'cm9abc123' })
    // @IsString()
    // @IsNotEmpty()
    // paymentMethodId: string;

    // funds added
    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    amount: number;

    // status
    @ApiPropertyOptional({ enum: TxStatus, example: TxStatus.PENDING })
    @IsEnum(TxStatus)
    @IsOptional()
    status?: TxStatus;

    // payment method (debit or credit or mobile payment)
    @ApiProperty({ type: PaymentMethodDto })
    @ValidateNested()
    @Type(() => PaymentMethodDto)
    @IsNotEmpty()
    paymentMethod: PaymentMethodDto;
}