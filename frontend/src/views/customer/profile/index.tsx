import { Card } from "@/components/ui/card";
import type { TabItem } from "@/types/tabs";
import { NavTabs } from "@/components/ui/nav-tabs";
import UserProfile from "./user-profile";
import Notification from "./notification";
import ProfileSecurity from "./security";
import { ProfileHeader } from "@/components/shared/ProfileHeader";

const profileTabs: TabItem[] = [
  { label: "Profile", href: "userprofile", component: UserProfile },
  { label: "Notifications", href: "notifications", component: Notification },
  { label: "Security", href: "security", component: ProfileSecurity },
];

export default function ProfilePage() {
  return (
    <div className="p-6 md:p-8">
      <Card className="p-0 bg-white border-0">
        {/* Profile Header */}
        <ProfileHeader
          avatarSrc="/avatar.png"
          avatarFallback="JD"
          name="John Doe"
          badge="VERIFIED CUSTOMER"
          memberSince="Member since January 2026"
        />
        <NavTabs tabs={profileTabs} mode="query" queryKey="tab" />
      </Card>
    </div>
  );
}