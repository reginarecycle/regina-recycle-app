import "../../../customer-dashboard.css"
import WelcomeMessage from "@/components/layout/customer-dashboard/welcome-message";
import { StatsCards } from "@/components/layout/customer-dashboard/stats-cards";
import ComingNext from "@/components/layout/customer-dashboard/coming-next";
import Schedule from "@/components/layout/customer-dashboard/schedule";
import WalletBalance from "@/components/layout/customer-dashboard/wallet-balance";
import DashboardTip from "@/components/layout/customer-dashboard/dashboard-tip";

export function dashboard() {
  return (
    <>
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
        <div className="right-bar">
          <WalletBalance />
          <DashboardTip />
        </div>
        <div className="large-components">
          <ComingNext
            pickup="Doorstep Pickup"
            date="Jan. 25, 2026"
            time="9:00AM -11:00AM"
            address="2314 Someon's House"
            bagNumber={8}
          />
          <Schedule />
        </div>
      </div>

    </>
  )
}

export default dashboard;