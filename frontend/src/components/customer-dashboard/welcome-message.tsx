import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/routes/hooks/use-router";
import { useCurrentUser } from "@/api-hooks/useAuth";
import { Routes } from "@/routes/routes";

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning",   emoji: "🥱" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
  return              { text: "Good Evening",   emoji: "🌙" };
}

export function WelcomeMessage() {
  const router = useRouter();
  const { data } = useCurrentUser();
  const user = data?.data;
  const { text, emoji } = getGreeting();

  return (
    <div className="flex justify-between flex-wrap gap-4 px-4 sm:px-6 lg:px-8 pt-6">
      <h1 className="text-2xl font-bold">
        {text}, {user?.name ?? ""} {emoji}
      </h1>

      <Button
        onClick={() => router.push(Routes.schedulePickup)}
        variant="outlineprimary"
        size="lg"
      >
        <Plus className="w-4 h-4"/>
        Schedule Pickup
      </Button>
    </div>
  );
}

export default WelcomeMessage;
