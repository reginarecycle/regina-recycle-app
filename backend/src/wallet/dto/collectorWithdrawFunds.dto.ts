import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsNotEmpty,
    IsString,
    IsEnum,
    Matches,
    MinLength, MaxLength
} from "class-validator";
import { Type } from "class-transformer";
import { TxStatus } from "@prisma/client";

export class CollectorWithdrawFundsDto {
    
    // not needed since this is automatically used from the current user
    // @ApiProperty({ example: 'cm9abc123' })
    // @IsString()
    // @IsNotEmpty()
    // userId: string;

    // bank details ----------------------------------------------------------------
    // collector can only widraw via bank

    // account holder name
    @ApiProperty({ example: "Jane Doe" })
    @IsString()
    @IsNotEmpty()
    accountHolderName: string;

    // bank name
    @ApiProperty({ example: "TD Bank" })
    @IsString()
    @IsNotEmpty()
    bankName: string;

    // account number
    @ApiProperty({ example: "123456789012" })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d+$/)
    @MinLength(6)
    @MaxLength(17)
    accountNumber: string;

    @ApiProperty({ example: "021000021" })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d+$/)
    @MinLength(5)
    @MaxLength(9)
    routingNumber: string;

    // ----------------------------------------------------------------

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