import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, Matches } from "class-validator";
import { TxType, TxStatus } from "@prisma/client";
import { PaginationDto } from "src/common/pagination/pagination.dto";

export class WalletTransactionQueryDto extends PaginationDto {
    @ApiPropertyOptional({ example: 'Payment for tins' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ enum: TxType, example: TxType.CREDIT })
    @IsEnum(TxType)
    @IsOptional()
    type?: TxType;

    @ApiPropertyOptional({ enum: TxStatus, example: TxStatus.COMPLETED })
    @IsEnum(TxStatus)
    @IsOptional()
    status?: TxStatus;

    @ApiPropertyOptional({ example: '2026-01-01' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'startDate must be in the format YYYY-MM-DD (e.g., 2026-01-01)',
    })
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({ example: '2026-12-31' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'endDate must be in the format YYYY-MM-DD (e.g., 2026-12-31)',
    })
    @IsOptional()
    endDate?: string;
}