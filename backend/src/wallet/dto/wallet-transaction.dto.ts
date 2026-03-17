import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum, IsDate } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TxType, TxStatus } from '@prisma/client';
import { Type } from "class-transformer";

// this is for the customer and the user

export class WalletTransactionDTO {
    @ApiPropertyOptional({ example: 'cm9abc123' })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    walletId!: string;

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

    // in the figma there are different labels being used for the collector or user
    // however only the status labels for the collector are defined
    @ApiProperty({ enum: TxStatus, example: TxStatus.PENDING })
    @IsEnum(TxStatus)
    @IsNotEmpty()
    status!: TxStatus;

    //   description   String?
    @ApiPropertyOptional({ example: 'This is a description of your earnings' })
    @IsString()
    @IsOptional()
    description?: string;

    // referenceType String?
    @ApiPropertyOptional({ example: 'CREDIT' })
    @IsString()
    @IsOptional()
    referenceType?: string;

    @ApiPropertyOptional({ example: 'cm9abc123' })
    @IsString()
    @IsOptional()
    referenceId?: string;

    // search
    @ApiPropertyOptional({ example: 'Payment for tins' })
    @IsString()
    @IsOptional()
    search?: string;

    // transaction time & date
    @ApiProperty({ example: '2026-03-16T18:25:43.511Z' })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    transactionDate!: Date;

    // sender -> sends the transaction
    // this is on the collector side
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    senderId!: string;

    // reciever -> is on the recieving end of the transaction
    // this is on the collector side
    @ApiProperty({ example: 'cm9abc123' })
    @IsString()
    @IsNotEmpty()
    receiverId!: string;

    // fees
    @ApiProperty({ example: 1.25 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    fees!: number;

    // topup -> still unsure on what role this plays

}