import WelcomeMessage from "@/components/customer-dashboard/welcome-message";
import { StatsCards } from "@/components/customer-dashboard/stats-cards";

const UserHome = () => {
  return (
    <div>
      <WelcomeMessage />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
        <StatsCards
          title="CO2"
          data={13}
          unit="Kg"
          color="red"
        />
        <StatsCards
          title="Total Recycle Quantity"
          data={0}
          unit="Units"
          color="green"
        />
        <StatsCards
          title="Water Saved"
          data={2}
          unit="Liters"
        />
        <StatsCards
          title="Pending Earnings"
          data={110}
          unit="CAD"
          color="gold"
          currency="$"
        />
      </div>
    </div>
  )
};

export default UserHome;
