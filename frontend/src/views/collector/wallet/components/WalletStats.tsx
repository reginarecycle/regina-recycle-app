import { ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeIcon: LucideIcon;
  badge: string;
  valueColor?: string;
}

interface WalletStatsProps {
  totalPayouts: number;
  netFlow: number;
  payoutsChange?: number;
  netFlowChange?: number;
}

export function WalletStats({
  totalPayouts,
  netFlow,
  payoutsChange = 0,
  netFlowChange = 0,
}: WalletStatsProps) {
  const formatChange = (val: number) => `${val >= 0 ? "+" : ""}${val.toFixed(1)}%`;

  const cards: StatCard[] = [
    {
      label:      "Total Payouts",
      value:      `$${totalPayouts.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`,
      subtitle:   "This month",
      icon:       ArrowDownRight,
      iconBg:     "bg-yellow-100",
      iconColor:  "text-yellow-600",
      badgeBg:    "bg-yellow-100",
      badgeText:  "text-yellow-700",
      badgeIcon:  ArrowDownRight,
      badge:      formatChange(payoutsChange),
    },
    {
      label:      "Net Flow",
      value:      `${netFlow >= 0 ? "+" : ""}$${Math.abs(netFlow).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`,
      subtitle:   "Last 30 days",
      icon:       TrendingUp,
      iconBg:     "bg-green-100",
      iconColor:  "text-green-600",
      badgeBg:    "bg-green-100",
      badgeText:  "text-green-700",
      badgeIcon:  TrendingUp,
      badge:      formatChange(netFlowChange),
      valueColor: netFlow >= 0 ? "text-green-600" : "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const BadgeIcon = card.badgeIcon;
        return (
          <div key={card.label} className="rounded-2xl bg-white border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", card.iconBg)}>
                  <Icon className={cn("w-4 h-4", card.iconColor)} />
                </div>
                <span className="text-sm text-muted-foreground">{card.label}</span>
              </div>
              <span className={cn("text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 shrink-0", card.badgeBg, card.badgeText)}>
                <BadgeIcon className="w-3 h-3" />
                {card.badge}
              </span>
            </div>
            <div className={cn("text-[28px] font-bold leading-none mb-2", card.valueColor ?? "text-foreground")}>
              {card.value}
            </div>
            <div className="text-xs text-muted-foreground">{card.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}