import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsNotEmpty,
    IsString,
    IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { TxStatus } from "@prisma/client";

export class CustomerWithdrawFundsDto {

    @ApiPropertyOptional({ example: 'cm9abc123' })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty({ example: 'john@doe@gmail.com' })
    @IsString()
    @IsNotEmpty()
    interacEmail: string;

    @ApiPropertyOptional({ example: "What is your favorite color?" })
    @IsString()
    @IsOptional()
    securityQuestion?: string;

    @ApiPropertyOptional({ example: "Green" })
    @IsString()
    @IsOptional()
    securityAnswer?: string;

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