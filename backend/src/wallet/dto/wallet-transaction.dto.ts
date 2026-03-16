import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TxType } from '@prisma/client';
import { Type } from "class-transformer";

export class WalletTransactionDTO {
    //   type          TxType
    @ApiProperty({ enum: TxType, example: TxType.CREDIT })
    @IsEnum(TxType)
    @IsNotEmpty()
    type!: TxType;

    //   amount        Decimal  @db.Decimal(14,2)
    // takes a number and stores it as a decimal after checking the decimal places
    @ApiProperty({ example: 100.52 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    amount!: number;

    //   description   String?
    @ApiPropertyOptional({ example: 'This is a description of your earnings' })
    @IsString()
    @IsOptional()
    description?: string;

    //   referenceType String?
    @ApiPropertyOptional({ example: 'CREDIT' })
    @IsString()
    @IsOptional()
    referenceType?: string;
}