import WelcomeMessage from "@/components/customer-dashboard/welcome-message";
import { StatsCards } from "@/components/customer-dashboard/stats-cards";
import ComingNext from "@/components/customer-dashboard/coming-next";
import WalletBalance from "@/components/customer-dashboard/wallet-balance";

const UserHome = () => {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeMessage />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* top row: stats cards */}
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

          {/* second row: coming next + wallet */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_288px] gap-4 sm:gap-6 items-start">
            <div className="min-w-0">
              <ComingNext
                pickup="Doorstep Pickup"
                date="Jan. 25, 2026"
                time="9:00AM -11:00AM"
                address="123 Lane, Str."
                bagNumber={3}
              />
            </div>

            <div className="w-full xl:w-[288px]">
              <WalletBalance
                balance={45.5}
                currency="CAD"
                stats={12.05}
                change="+"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;