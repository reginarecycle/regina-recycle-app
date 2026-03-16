import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class WalletDto {
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    balance: number;
}

// add a payment method dto
// add withdraw request dto
// wallet id
// user id
// total payout this month
// username