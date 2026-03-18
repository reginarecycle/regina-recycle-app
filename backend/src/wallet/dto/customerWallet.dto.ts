import { ApiProperty } from "@nestjs/swagger";

export class CustomerWalletDto {
    @ApiProperty({ example: "cm9abc123" })
    userId!: string;

    @ApiProperty({ example: "wallet_123" })
    walletId!: string;

    @ApiProperty({ example: 0.0 })
    balance!: number;

    @ApiProperty({ example: 0.0 })
    monthlyEarnings!: number;

    @ApiProperty({ example: 0.0 })
    yearlyEarnings!: number;

    // for the pending earnings view in the customer dashboard
    @ApiProperty({ example: 0.0 })
    pendingEarningsAmount!: number;

    // for the wallet balance card at the bottom
    @ApiProperty({ example: 0.0 })
    earningsChangeAmount!: number;
}