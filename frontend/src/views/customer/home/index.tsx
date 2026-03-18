import WelcomeMessage from "@/components/customer-dashboard/welcome-message";
import { StatsCards } from "@/components/customer-dashboard/stats-cards";
import ComingNext from "@/components/customer-dashboard/coming-next";
import WalletBalance from "@/components/customer-dashboard/wallet-balance";
import DashboardTip from "@/components/customer-dashboard/tip-card";
import Schedule from "@/components/customer-dashboard/schedule-table";

const UserHome = () => {
  return (
    <div className="flex flex-col gap-6 overflow-scroll mb-8">
      <WelcomeMessage />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* stats cards row at the top */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <StatsCards
              title="CO2 Saved"
              data={4}
              unit="kg"
              color="red"
            />
            <StatsCards
              title="Total Recycle Quantity"
              data={24}
              unit="units"
              color="green"
            />
            <StatsCards
              title="Water Saved"
              data={72}
              unit="Liters"
              color="blue"
            />
            <StatsCards
              title="Pending Earnings"
              data={124}
              unit="CAD"
              color="gold"
              currency="$"
            />
          </div>

          {/* lower section */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_288px] gap-4 sm:gap-6 items-start">
            {/* left column */}
            <div className="min-w-0 flex flex-col gap-4 sm:gap-6">
              <ComingNext
                pickup="Doorstep Pickup"
                date="Jan. 25, 2026"
                time="9:00AM -11:00AM"
                address="123 Lane, Str."
                bagNumber={3}
              />

              <Schedule />
            </div>

            {/* right column */}
            <div className="w-full xl:w-[288px] flex flex-col gap-4 sm:gap-6">
              <WalletBalance
                balance={45.5}
                currency="CAD"
                stats={12.05}
                change="+"
              />

              <DashboardTip />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;