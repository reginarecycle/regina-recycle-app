import WelcomeMessage from "@/components/customer-dashboard/welcome-message";
import { StatsCards, type StatItem } from "@/components/customer-dashboard/stats-cards";
import ComingNext from "@/components/customer-dashboard/coming-next";
import WalletBalance from "@/components/customer-dashboard/wallet-balance";
import DashboardTip from "@/components/customer-dashboard/tip-card";
import Schedule from "@/components/customer-dashboard/schedule-table";

const STATS: StatItem[] = [
  { title: "CO2 Saved",              data: 4,   unit: "kg",    color: "red"   },
  { title: "Total Recycle Quantity", data: 24,  unit: "units", color: "green" },
  { title: "Water Saved",            data: 72,  unit: "Liters",color: "blue"  },
  { title: "Pending Earnings",       data: 124, unit: "CAD",   color: "gold", currency: "$" },
];

// Defined once, referenced in both mobile and sidebar slots
const wallet = <WalletBalance balance={45.5} currency="CAD" stats={12.05} change="+" />;
const tip    = <DashboardTip />;

const UserHome = () => (
  <div className="flex flex-col gap-6 overflow-scroll mb-8">
    <WelcomeMessage />

    <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      <StatsCards items={STATS} />

      {/* Wallet — mobile only, right after stats */}
      <div className="xl:hidden">{wallet}</div>

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

          {/* Tip — mobile only, after Schedule */}
          <div className="xl:hidden">{tip}</div>
        </div>

        {/* Sidebar — xl+ only */}
        <div className="hidden xl:flex flex-col gap-4">
          {wallet}
          {tip}
        </div>
      </div>
    </div>
  </div>
);

export default UserHome;
