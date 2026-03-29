import { Card } from "@/components/ui/card";
import { NavTabs } from "@/components/ui/nav-tabs";
import type { TabItem } from "@/types/tabs";
import { CollectorProfileTab }       from "./CollectorProfileTab";
import { CollectorPricingTab }        from "./CollectorPricingTab";
import { CollectorSecurityTab }       from "./CollectorSecurityTab";
import { CollectorNotificationsTab }  from "./CollectorNotificationsTab";

const collectorTabs: TabItem[] = [
  { label: "Profile",       href: "profile",       component: CollectorProfileTab      },
  { label: "Pricing",       href: "pricing",       component: CollectorPricingTab       },
  { label: "Security",      href: "security",      component: CollectorSecurityTab      },
  { label: "Notifications", href: "notifications", component: CollectorNotificationsTab },
];

export default function CollectorSettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <Card className="pt-3 bg-white shadow-none border-0">
        <NavTabs tabs={collectorTabs} mode="query" queryKey="tab" />
      </Card>
    </div>
  );
}

