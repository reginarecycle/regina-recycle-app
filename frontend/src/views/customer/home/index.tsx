import "../../../customer-dashboard.css"
import { WelcomeMessage } from "@/components/layout/welcome-message";
import { StatsCards } from "@/components/layout/stats-cards";

export function dashboard() {
  return (
    <div className="main-content">
      <WelcomeMessage name="John Doe" />
      <div className="stats-wrapper">
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
          unit="L"
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
}

export default dashboard;