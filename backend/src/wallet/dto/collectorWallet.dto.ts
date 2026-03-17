import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CollectorWalletDto {
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    walletId: string;

    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    balance: number;

    // total payouts
    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    monthlyPayouts: number;

    // monthly net flow
    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    monthlyNetFlow: number;

}