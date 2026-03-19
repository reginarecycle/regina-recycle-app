import { ApiProperty } from "@nestjs/swagger";

export class CollectorWalletDto {
    @ApiProperty({ example: 'cm9abc123' })
    userId: string;

    @ApiProperty({ example: 'wallet_123' })
    walletId: string;

    @ApiProperty({ example: 100.00 })
    balance: number;

    // total payouts for the current month
    @ApiProperty({ example: 250.50 })
    monthlyPayouts: number;

    // net flow 
    @ApiProperty({ example: 120.75 })
    monthlyNetFlow: number;

    // for the pending requests card in the collector dashboard
    @ApiProperty({ example: 0.0 })
    pendingRequestsAmount: number;

    // for the pending requests card in the collector dashboard (the smaller text on the bottom)
    @ApiProperty({ example: 0.0 })
    pendingApprovalAmount: number;
}