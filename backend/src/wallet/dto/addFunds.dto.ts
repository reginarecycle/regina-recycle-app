import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

// this is only needed for the collector

export class UpdateWalletDto {

    @ApiPropertyOptional({ example: 100.00 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    balance?: number;

    // funds added


    //payment method (deboit or credit or mobile payment)

    //status

    //wallet id

}