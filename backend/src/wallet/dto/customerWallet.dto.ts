import { IsNumber, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CustomerWalletDto {
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    walletId!: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    balance!: number;

    // shows how much was earned each month
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    monthlyEarnings!: number;

    // shows how much was earned over the year
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    yearlyEarnings!: number;
}