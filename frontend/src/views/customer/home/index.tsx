import WelcomeMessage from "@/components/customer-dashboard/welcome-message";
import { StatsCards, type StatItem } from "@/components/customer-dashboard/stats-cards";
import ComingNext from "@/components/customer-dashboard/coming-next";
import WalletBalance from "@/components/customer-dashboard/wallet-balance";
import DashboardTip from "@/components/customer-dashboard/tip-card";
import Schedule from "@/components/customer-dashboard/schedule-table";
import { useCustomerWallet } from "@/api-hooks/useWallet";
import { useGetTip } from "@/api-hooks/useTips";
import { useCustomerDashboardStats } from "@/api-hooks/useCustomer.ts";

const UserHome = () => {
  // ── API data — unwrap .data from ApiResult wrapper ──────────────────────────
  const { data: walletResult } = useCustomerWallet();
  const { data: tipResult, isLoading: tipLoading } = useGetTip();
  const { data: statsResult  } = useCustomerDashboardStats();

  const wallet = walletResult?.data;
  const tip    = tipResult?.data;
  const stats  = statsResult?.data;

  // ── Stats cards ──────────────────────────────────────────────────────────────
  const STATS: StatItem[] = [
    {
      title:  "CO2 Saved",
      data:   stats?.co2Saved      ?? 0,
      unit:   "kg",
      color:  "red",
    },
    {
      title:  "Total Recycle Quantity",
      data:   stats?.totalQuantity ?? 0,
      unit:   "units",
      color:  "green",
    },
    {
      title:  "Water Saved",
      data:   stats?.waterSaved    ?? 0,
      unit:   "Liters",
      color:  "blue",
    },
    {
      title:    "Pending Earnings",
      data:     wallet?.pendingEarningsAmount ?? 0,
      unit:     "CAD",
      color:    "gold",
      currency: "$",
    },
  ];

  // ── Wallet card ──────────────────────────────────────────────────────────────
  const walletCard = (
    <WalletBalance
      balance={wallet?.balance ?? 0}
      currency="CAD"
      stats={wallet?.earningsChangeAmount ?? 0}
      change={(wallet?.earningsChangeAmount ?? 0) >= 0 ? "+" : "-"}
    />
  );

  // ── Tip card ─────────────────────────────────────────────────────────────────
  const tipCard = (
    <DashboardTip
      content={tip?.content ?? undefined}
      isLoading={tipLoading}
    />
  );

  return (
    <div className="flex flex-col gap-6 overflow-scroll mb-8">
      <WelcomeMessage />

      <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <StatsCards items={STATS} />

        {/* Wallet — mobile only */}
        <div className="xl:hidden">{walletCard}</div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_288px] gap-6 items-start">
          {/* Main column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <ComingNext
              pickup="Doorstep Pickup"
              date="Jan. 25, 2026"
              time="9:00AM - 11:00AM"
              address="123 Lane, Str."
              bagNumber={3}
            />
            <Schedule />

            {/* Tip — mobile only */}
            <div className="xl:hidden">{tipCard}</div>
          </div>

          {/* Sidebar — xl+ only */}
          <div className="hidden xl:flex flex-col gap-4">
            {walletCard}
            {tipCard}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;