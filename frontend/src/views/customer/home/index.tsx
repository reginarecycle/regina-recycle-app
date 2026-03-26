import { useMemo } from "react";
import WelcomeMessage from "@/components/customer-dashboard/welcome-message";
import { StatsCards, type StatItem } from "@/components/customer-dashboard/stats-cards";
import ComingNext from "@/components/customer-dashboard/coming-next";
import WalletBalance from "@/components/customer-dashboard/wallet-balance";
import DashboardTip from "@/components/customer-dashboard/tip-card";
import Schedule from "@/components/customer-dashboard/schedule-table";
import { useCustomerDashboardStats } from "@/api-hooks/useCustomer";
import { useCustomerWallet } from "@/api-hooks/useWallet";
import { useGetTip } from "@/api-hooks/useTips";
import { useGetCustomerPickups } from "@/api-hooks/usePickups";

const UserHome = () => {
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const { data: statsResult,   isError: statsError   } = useCustomerDashboardStats();
  const { data: walletResult,  isError: walletError  } = useCustomerWallet();
  const { data: tipResult,     isError: tipError     } = useGetTip();
  const { data: upcomingResult } = useGetCustomerPickups({
    limit: 10, page: 1, startDate: todayStart,
  });
  const { data: scheduleResult } = useGetCustomerPickups({
    limit: 5, page: 1,
  });

  const stats          = (statsResult  as any)?.data ?? statsResult  as any;
  const wallet         = (walletResult as any)?.data ?? walletResult as any;
  const tip            = (tipResult    as any)?.data ?? tipResult    as any;
  const recentSchedule = (scheduleResult as any)?.data?.data ?? [];

  const nextPickup: any = ((upcomingResult as any)?.data?.data ?? [])
    .filter((p: any) => p.status === "PENDING" || p.status === "ACCEPTED")
    .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] ?? null;

  const STATS: StatItem[] = [
    { title: "CO2 Saved",              data: stats?.co2Saved             ?? 0, unit: "kg",    color: "red"                 },
    { title: "Total Recycle Quantity", data: stats?.totalRecycleQuantity ?? 0, unit: "units", color: "green"               },
    { title: "Water Saved",            data: stats?.waterSaved           ?? 0, unit: "Liters", color: "blue"               },
    { title: "Pending Earnings",       data: stats?.pendingEarnings      ?? 0, unit: "CAD",   color: "gold", currency: "$" },
  ];

  const walletCard = (
    <WalletBalance
      balance={wallet?.balance ?? 0}
      currency="CAD"
      stats={wallet?.earningsChangeAmount ?? 0}
      change={(wallet?.earningsChangeAmount ?? 0) >= 0 ? "+" : "-"}
    />
  );

  const comingNext = nextPickup ? (
    <ComingNext
      pickup="Recycling Pickup"
      date={new Date(nextPickup.scheduledAt).toLocaleDateString("en-CA", {
    month: "short", day: "numeric", year: "numeric",
    })}
     time={new Date(nextPickup.scheduledAt).toLocaleTimeString("en-CA", {
     hour: "numeric", minute: "2-digit", hour12: true,
    })}
      address={nextPickup.address
        ? `${nextPickup.address.line1}, ${nextPickup.address.city}`
        : "N/A"}
      bagNumber={nextPickup.items?.length ?? 0}
    />
  ) : (
    <ComingNext />
  );

  // ── Error state ───────────────────────────────────────────────────────────
  if (statsError || walletError) {
    return (
      <div className="flex flex-col gap-6 overflow-scroll mb-8">
        <WelcomeMessage />
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to load dashboard data. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

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
            {comingNext}
            <Schedule />
            <div className="xl:hidden">
              <DashboardTip content={tipError ? undefined : tip?.content} />
            </div>
          </div>

          {/* Sidebar — xl+ only */}
          <div className="hidden xl:flex flex-col gap-4">
            {walletCard}
            <DashboardTip content={tipError ? undefined : tip?.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;