import { Card } from "@/components/ui/card";
import type { TabItem } from "@/types/tabs";
import { NavTabs } from "@/components/ui/nav-tabs";
import UserProfile from "./user-profile";
import Notification from "./notification";
import ProfileSecurity from "./security";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { useCurrentUser } from "@/api-hooks/useAuth";

const profileTabs: TabItem[] = [
  { label: "Profile", href: "userprofile", component: UserProfile },
  { label: "Notifications", href: "notifications", component: Notification },
  { label: "Security", href: "security", component: ProfileSecurity },
];

export default function ProfilePage() {
  const { data, isLoading } = useCurrentUser();
  const user = data?.data;
  
   const formatMemberSince = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div className="p-6 md:p-8">
      <Card className="p-0 bg-white border-0">
        <ProfileHeader
          avatarSrc="/avatar.png"
          avatarFallback={user?.name?.charAt(0)??""}
          name={user?.name ?? ""}
          badge="VERIFIED CUSTOMER"
          memberSince={`Member since ${formatMemberSince(user?.createdAt)}`}
          isLoading={isLoading}
        />
        <NavTabs tabs={profileTabs} mode="query" queryKey="tab" />
      </Card>
    </div>
  );
}