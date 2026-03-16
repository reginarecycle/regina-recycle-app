import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class WalletDto {
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    balance: number;
}