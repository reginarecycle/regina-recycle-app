import "../../../customer-dashboard.css"
import { WelcomeMessage } from "@/components/layout/welcome-message";
import { StatsCards } from "@/components/layout/stats-cards";

export function dashboard() {
  return (
    <div className="main-content">
      <WelcomeMessage name="Your Mom" />
      <div className="stats-wrapper">
        <StatsCards title="CO2" />
        <StatsCards title="Total Recycle Quantity" />
        <StatsCards title="Water Saved" />
      </div>
    </div>
  )
}

export default dashboard;