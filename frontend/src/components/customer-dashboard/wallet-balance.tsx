import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/routes/hooks/use-router";
import { Routes } from "@/routes/routes";
import { formatCurrency } from "@/lib/utils";
import GreenArrow from "@/assets/green-arrow.svg";
import CashMultiple from "@/assets/cash-multiple.svg";

type Props = {
  balance?:   number;
  currency?:  string;
  stats?:     number;
  change?:    "+" | "-";
  isLoading?: boolean;
};

export function WalletBalance({
  balance   = 0,
  currency  = "CAD",
  stats     = 0,
  change    = "+",
  isLoading = false,
}: Props) {
  const router     = useRouter();
  const [visible, setVisible] = useState(true);
  const isPositive = change === "+";

  return (
    <Card className="w-full rounded-2xl border border-border bg-white shadow-none overflow-hidden py-4!">
      <CardHeader className="border-b border-border px-6 py-1!">
        <p className="text-base font-bold text-foreground">Wallet Balance</p>
      </CardHeader>

      <CardContent className="px-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Available Funds
          </span>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-foreground hover:text-primary transition-colors"
            aria-label={visible ? "Hide balance" : "Show balance"}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Balance */}
        {isLoading ? (
          <div className="h-10 w-40 rounded bg-gray-100 animate-pulse" />
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold tracking-tight text-foreground inline-flex items-center gap-0.5">
              {visible
                ? formatCurrency(balance, currency)
                : <>$<span className="text-2xl self-center tracking-widest leading-none">*******</span></>
              }
            </span>
          </div>
        )}

        {/* Monthly change */}
        {isLoading ? (
          <div className="h-4 w-48 rounded bg-gray-100 animate-pulse" />
        ) : (
          <div className="flex items-center gap-1">
            <img src={GreenArrow} alt="" className="w-8 h-8 shrink-0" />
            <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {`${change}${formatCurrency(stats, currency)} this month`}
            </span>
          </div>
        )}

        {/* CTA */}
        <Button
          size="lg"
          className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          onClick={() => router.push(Routes.wallet)}
        >
          <img src={CashMultiple} alt="" className="w-5 h-5 shrink-0 mr-1.5" />
          Withdraw Funds
        </Button>
      </CardContent>
    </Card>
  );
}

export default WalletBalance;