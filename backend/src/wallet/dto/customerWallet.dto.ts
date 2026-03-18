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
}