import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { Bell } from "lucide-react";
import type { Notification, BackendNotification } from "@/types/notification";

function mapToFrontend(n: BackendNotification): Notification {
  const typeMap: Record<string, Notification["type"]> = {
    PICKUP_SCHEDULED: "info",
    IN_APP_PICKUP_REMINDER: "info",
    EMAIL_PICKUP_REMINDER:  "info",
    ACCOUNT_ACTIVITY:       "success",
    PAYMENT_ACTIVITY:       "success",
    MARKETING:              "info",
    ALERT:                  "warning",
  };

  const categoryMap: Record<string, Notification["category"]> = {
    PICKUP_SCHEDULED: "pickups",
    IN_APP_PICKUP_REMINDER: "pickups",
    EMAIL_PICKUP_REMINDER:  "pickups",
    ACCOUNT_ACTIVITY:       "account",
    PAYMENT_ACTIVITY:       "payments",
    MARKETING:              "account",
    ALERT:                  "alerts",
  };

  return {
    id: n.notificationId,
    type: typeMap[n.type] ?? "info",
    category: categoryMap[n.type] ?? "alerts",
    title: n.title,
    message: n.message,
    timestamp: new Date(n.createdAt),
    read: n.isRead,
    icon: <Bell size={16} />,
  };
}

let pusherInstance: Pusher | null = null;

function getPusher(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    });
  }
  return pusherInstance;
}

export function usePusherNotifications(
  userId: string | undefined,
  onNotification: (n: Notification) => void,
) {
  // Keep latest callback in a ref so we don't restart the effect when it changes
  const callbackRef = useRef(onNotification);
  callbackRef.current = onNotification;

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusher();
    const channel = pusher.subscribe(`user-${userId}`);

    channel.bind("notification", (data: BackendNotification) => {
      callbackRef.current(mapToFrontend(data));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`user-${userId}`);
    };
  }, [userId]);
}
