import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import GreenArrow from "@/assets/green-arrow.svg";
import CashMultiple from "@/assets/cash-multiple.svg";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/routes/hooks/use-router";

type Props = {
    balance: number;
    currency: string;
    stats: number;
    change?: "+" | "-";
};

export function WalletBalance({
    balance = 45.5,
    currency = "CAD",
    stats = 12.05,
    change = "+",
}: Props) {

    const router = useRouter();

    const handleWallet = () => {
        router.push("/app/wallet"); // takes the user to the wallet page
    };

    const isPositive = change === "+";

    return (
        <Card className="w-full min-w-0 !py-3 gap-3 rounded-2xl border border-[#CFCFCF] bg-white shadow-none overflow-hidden max-w-[288px]">
            <div className="px-4 min-w-0">
                <CardTitle className="text-[18px] leading-7 font-bold text-[#0C111D]">
                    Wallet Balance
                </CardTitle>
            </div>

            <div className="mx-4 h-px bg-[#D4D4D4]" />

            <CardContent className="px-4 pt-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12px] leading-5 font-semibold uppercase text-[#8C8F96]">
                        Available Funds
                    </span>
                    <Eye className="h-5 w-5 text-[#111827] shrink-0" strokeWidth={2.2} />
                </div>

                <div className="mt-3 flex items-end gap-1 min-w-0 flex-wrap">
                    <span className="text-[42px] leading-none font-bold tracking-[-0.02em] text-[#0F172A] break-words">
                        ${balance.toFixed(2)}
                    </span>
                    <span className="mb-1 text-[18px] leading-6 font-semibold text-[#0F172A] shrink-0">
                        {currency}
                    </span>
                </div>

                <div className="mt-5 flex items-center gap-0 min-w-0 flex-wrap">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <img
                            src={GreenArrow}
                            alt="Balance change"
                            className="shrink-0"
                        />
                    </div>

                    <span
                        className={`text-[16px] leading-5 font-semibold break-words ${isPositive ? "text-[#4CAF23]" : "text-[#DD1E1E]"
                            }`}
                    >
                        {change}${stats.toFixed(2)} {currency} this month
                    </span>
                </div>

                <Button
                    onClick={handleWallet}
                    size="lg"
                    className="mt-6 h-12 w-full rounded-[8px] bg-[#3B5B4A] text-[16px] font-semibold text-white hover:bg-[#618171]"
                >
                    <img
                        src={CashMultiple}
                        alt="Withdraw"
                        className="mr-2 h-5 w-5 object-contain shrink-0"
                    />
                    Withdraw Funds
                </Button>
            </CardContent>
        </Card>
    );
}

export default WalletBalance;