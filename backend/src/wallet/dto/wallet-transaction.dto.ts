import {
    IsString,
    IsNumber,
    IsOptional,
    IsNotEmpty,
    IsEnum,
    IsDate,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TxType, TxStatus } from "@prisma/client";
import { Type } from "class-transformer";

export class WalletTransactionDto {
    @ApiPropertyOptional({ example: "cm9abc123" })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty({ example: "wallet_123" })
    @IsString()
    @IsNotEmpty()
    walletId!: string;

    // shows the direction of flow of the money
    // debit is negative, credit is positive
    @ApiProperty({ enum: TxType, example: TxType.CREDIT })
    @IsEnum(TxType)
    @IsNotEmpty()
    type!: TxType;

    @ApiProperty({ example: 100.52 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    amount!: number;

    @ApiProperty({ enum: TxStatus, example: TxStatus.PENDING })
    @IsEnum(TxStatus)
    @IsNotEmpty()
    status!: TxStatus;

    @ApiPropertyOptional({ example: "Payment for recycling" })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: "TOP_UP" })
    @IsString()
    @IsOptional()
    referenceType?: string;

    @ApiPropertyOptional({ example: "cm9abc123" })
    @IsString()
    @IsOptional()
    referenceId?: string;

    @ApiProperty({ example: "2026-03-16T18:25:43.511Z" })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;

    @ApiPropertyOptional({ example: "cm9abc123" })
    @IsString()
    @IsOptional()
    senderId?: string;

    @ApiPropertyOptional({ example: "cm9abc123" })
    @IsString()
    @IsOptional()
    receiverId?: string;

    @ApiPropertyOptional({ example: 1.25 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    fees?: number;
}