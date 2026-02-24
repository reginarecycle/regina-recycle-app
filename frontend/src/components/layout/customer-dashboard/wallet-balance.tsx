import { Card, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Eye } from "lucide-react";
import GreenArrow from "@/assets/green-arrow.svg"
import { Button } from "@/components/ui/button";
import CashMultiple from "@/assets/cash-multiple.svg"


type props = {
    balance: number;
    currency: string;
    stats: number
    change: string;
}

export function WalletBalance({
    balance = 0.00,
    currency = "CAD",
    stats = 0.00,
    change = "+",
}: props) {
    return (
        <Card className="wallet-balance-card bg-[#FFFFFF] gap-6 w-[288px]">
            <CardTitle className="wallet-title">Wallet Balance</CardTitle>
            <CardContent className="wallet-content">
                <h2 className="-ml-6">
                    AVAILABLE FUNDS
                    <Eye className="text-[#0C111D] -mt-0.5 h-6 w-6" />
                </h2>
                <h1 className="-ml-6 flex">
                    ${balance.toFixed(2)}
                    <p className="text-sm">{currency}</p>
                </h1>
                <h3 className="flex -ml-6 pt-4 gap-1 mt-auto">
                    <img src={GreenArrow} />
                    <span className="mt-auto mb-1.25">{change}{stats.toFixed(2)} {currency} this month</span>
                </h3>
            </CardContent>
            <div className="withdraw-wrapper mt-5">
                <Button className="withdraw-button w-full h-13 gap-2.5">
                    <img src={CashMultiple} />
                    Withdraw Funds
                </Button>
            </div>
        </Card>
    )
}

export default WalletBalance;