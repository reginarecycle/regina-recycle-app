import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateWalletDto {
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
    @IsOptional()
    balance: number;

    // total payouts
    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    totalPayouts: number;

    // monthly net flow
    @ApiProperty({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    monthlyNetFlow: number;

}