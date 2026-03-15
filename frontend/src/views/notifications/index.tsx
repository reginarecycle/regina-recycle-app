import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Clock,
    CheckCircle2,
    AlertTriangle,
    DollarSign,
    Truck,
    XCircle,
    MoreVertical,
    Trash2,
    EyeOff,
    Users,
    Package,
    CheckCheck,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type NotificationType = "success" | "warning" | "error" | "info";
type CustomerCategory = "all" | "pickups" | "payments" | "alerts" | "account";
type CollectorCategory = "all" | "requests" | "payments" | "alerts" | "account";
type NotificationCategory = CustomerCategory | CollectorCategory;
type ViewMode = "all" | "unread" | "read";

interface Notification {
    id: string;
    type: NotificationType;
    category: NotificationCategory;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
    icon: React.ReactNode;
}

interface NotificationsPageProps {
    userRole?: "customer" | "collector";
}

export default function NotificationsPage({
    userRole = "customer",
}: NotificationsPageProps) {
    const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    // Customer notifications
    const customerNotifications: Notification[] = [
        {
            id: "1",
            type: "success",
            category: "pickups",
            title: "Pickup Confirmed",
            message: "Your pickup has been scheduled for tomorrow at 2:00 PM",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            read: false,
            link: "/app/schedule",
            icon: <CheckCircle2 className="h-5 w-5" />,
        },
        {
            id: "2",
            type: "info",
            category: "pickups",
            title: "Pickup Reminder",
            message:
                "Your scheduled pickup is in 1 hour. Please have your materials ready.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false,
            link: "/app/schedule",
            icon: <Truck className="h-5 w-5" />,
        },
        {
            id: "3",
            type: "success",
            category: "payments",
            title: "Payment Received",
            message: "You've earned $45.50 from your recent pickup",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: true,
            link: "/app/wallet",
            icon: <DollarSign className="h-5 w-5" />,
        },
        {
            id: "4",
            type: "warning",
            category: "alerts",
            title: "Weather Alert",
            message: "Severe weather expected tomorrow. Pickup may be delayed.",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: true,
            link: "/app/schedule",
            icon: <AlertTriangle className="h-5 w-5" />,
        },
        {
            id: "5",
            type: "error",
            category: "pickups",
            title: "Pickup Cancelled",
            message:
                "Your pickup scheduled for Dec 15 has been cancelled due to weather conditions.",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
            link: "/app/schedule",
            icon: <XCircle className="h-5 w-5" />,
        },
        {
            id: "6",
            type: "info",
            category: "account",
            title: "Profile Updated",
            message: "Your account information has been successfully updated.",
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            read: true,
            icon: <Clock className="h-5 w-5" />,
        },
    ];

    // Collector notifications
    const collectorNotifications: Notification[] = [
        {
            id: "1",
            type: "info",
            category: "requests",
            title: "New Collection Request",
            message: "John Doe has requested a pickup for 50 kg of materials",
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            read: false,
            link: "/app/collector/requests",
            icon: <Package className="h-5 w-5" />,
        },
        {
            id: "2",
            type: "warning",
            category: "requests",
            title: "Request Cancelled",
            message: "Customer has cancelled the pickup scheduled for tomorrow",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            read: false,
            link: "/app/collector/requests",
            icon: <XCircle className="h-5 w-5" />,
        },
        {
            id: "3",
            type: "success",
            category: "payments",
            title: "Payment Sent",
            message: "Payment of $125.00 has been sent to John Doe",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            read: true,
            link: "/app/collector/wallet",
            icon: <DollarSign className="h-5 w-5" />,
        },
        {
            id: "4",
            type: "info",
            category: "requests",
            title: "Pickup Completed",
            message: "Collection from Jane Smith has been marked as completed",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: true,
            link: "/app/collector/requests",
            icon: <CheckCircle2 className="h-5 w-5" />,
        },
        {
            id: "5",
            type: "warning",
            category: "alerts",
            title: "Weather Alert",
            message: "Severe weather expected tomorrow. Plan your routes accordingly.",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: true,
            link: "/app/collector/dashboard",
            icon: <AlertTriangle className="h-5 w-5" />,
        },
        {
            id: "6",
            type: "info",
            category: "account",
            title: "New Customer",
            message: "A new customer has joined your service area",
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            read: true,
            link: "/app/collector/users",
            icon: <Users className="h-5 w-5" />,
        },
    ];

    const [notifications, setNotifications] = useState<Notification[]>(
        userRole === "customer" ? customerNotifications : collectorNotifications
    );

    const tabs =
        userRole === "customer"
            ? [
                { value: "all", label: "All" },
                { value: "pickups", label: "Pickups" },
                { value: "payments", label: "Payments" },
                { value: "alerts", label: "Alerts" },
                { value: "account", label: "Account" },
            ]
            : [
                { value: "all", label: "All" },
                { value: "requests", label: "Requests" },
                { value: "payments", label: "Payments" },
                { value: "alerts", label: "Alerts" },
                { value: "account", label: "Account" },
            ];

    const getTypeStyles = (type: NotificationType) => {
        const styles = {
            success: {
                bg: "bg-green-50",
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
                border: "border-green-200",
            },
            warning: {
                bg: "bg-yellow-50",
                iconBg: "bg-yellow-100",
                iconColor: "text-yellow-600",
                border: "border-yellow-200",
            },
            error: {
                bg: "bg-red-50",
                iconBg: "bg-red-100",
                iconColor: "text-red-600",
                border: "border-red-200",
            },
            info: {
                bg: "bg-blue-50",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                border: "border-blue-200",
            },
        };
        return styles[type];
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const groupByDate = (notifications: Notification[]) => {
        const groups: { [key: string]: Notification[] } = {
            Today: [],
            Yesterday: [],
            "This Week": [],
            Older: [],
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        notifications.forEach((notification) => {
            const notifDate = new Date(notification.timestamp);
            const notifDay = new Date(
                notifDate.getFullYear(),
                notifDate.getMonth(),
                notifDate.getDate()
            );

            if (notifDay.getTime() === today.getTime()) {
                groups.Today.push(notification);
            } else if (notifDay.getTime() === yesterday.getTime()) {
                groups.Yesterday.push(notification);
            } else if (notifDate >= weekAgo) {
                groups["This Week"].push(notification);
            } else {
                groups.Older.push(notification);
            }
        });

        return groups;
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
        );
    };

    const handleMarkAsUnread = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, read: false } : notif
            )
        );
    };

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, read: true }))
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleClearRead = () => {
        setNotifications((prev) => prev.filter((notif) => !notif.read));
    };

    // Filtered and sorted notifications
    const processedNotifications = useMemo(() => {
        let filtered = notifications;

        // Filter by category
        if (activeTab !== "all") {
            filtered = filtered.filter((n) => n.category === activeTab);
        }

        // Filter by view mode
        if (viewMode === "unread") {
            filtered = filtered.filter((n) => !n.read);
        } else if (viewMode === "read") {
            filtered = filtered.filter((n) => n.read);
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "newest") {
                return b.timestamp.getTime() - a.timestamp.getTime();
            } else {
                return a.timestamp.getTime() - b.timestamp.getTime();
            }
        });

        return sorted;
    }, [notifications, activeTab, viewMode, sortBy]);

    const groupedNotifications = groupByDate(processedNotifications);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <Card className="p-0 bg-white shadow-none border-0">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                    : "You're all caught up!"}
                            </p>
                        </div>

                        {/* Actions - Desktop only */}
                        {notifications.length > 0 && (
                            <div className="hidden sm:flex gap-2">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 gap-2"
                                        onClick={handleMarkAllAsRead}
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        Mark all read
                                    </Button>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleClearRead}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear read
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={handleClearAll}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear all
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* Mobile Actions */}
                        {notifications.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 sm:hidden">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {unreadCount > 0 && (
                                        <DropdownMenuItem onClick={handleMarkAllAsRead}>
                                            <CheckCheck className="h-4 w-4 mr-2" />
                                            Mark all read
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleClearRead}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear read
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={handleClearAll}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear all
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Filters - Clean single row */}
                    {notifications.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* View Mode Pills */}
                            <div className="flex gap-1 p-1 bg-muted rounded-lg">
                                <Button
                                    variant={viewMode === "all" ? "default" : "ghost"}
                                    size="sm"
                                    className={`h-8 px-3 ${viewMode === "all" ? "shadow-sm" : ""}`}
                                    onClick={() => setViewMode("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={viewMode === "unread" ? "default" : "ghost"}
                                    size="sm"
                                    className={`h-8 px-3 gap-1.5 ${viewMode === "unread" ? "shadow-sm" : ""}`}
                                    onClick={() => setViewMode("unread")}
                                >
                                    Unread
                                    {unreadCount > 0 && viewMode !== "unread" && (
                                        <Badge className="ml-1 h-5 px-1.5 bg-primary text-white border-0">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                                <Button
                                    variant={viewMode === "read" ? "default" : "ghost"}
                                    size="sm"
                                    className={`h-8 px-3 ${viewMode === "read" ? "shadow-sm" : ""}`}
                                    onClick={() => setViewMode("read")}
                                >
                                    Read
                                </Button>
                            </div>

                            {/* Sort */}
                            <Select
                                value={sortBy}
                                onValueChange={(value: any) => setSortBy(value)}
                            >
                                <SelectTrigger className="w-full sm:w-[130px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Tabs - Clean minimal design */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as NotificationCategory)
                    }
                    className="w-full"
                >
                    <div className="border-b border-gray-200">
                        <div className="px-4 sm:px-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <TabsList className="w-full sm:w-auto inline-flex h-12 bg-transparent border-b-0 p-0">
                                {tabs.map((tab) => {
                                    const tabUnreadCount = notifications.filter(
                                        (n) =>
                                            !n.read && (tab.value === "all" || n.category === tab.value)
                                    ).length;
                                    return (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="relative h-12 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 gap-1 shrink-0 -mb-[1px]"
                                        >
                                            {tab.label}
                                            {tabUnreadCount > 0 && (
                                                <Badge className="bg-primary text-white border-0 h-5 min-w-5 px-1.5 text-xs">
                                                    {tabUnreadCount}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="mt-0">
                        <div className="p-4 sm:p-6">
                            {processedNotifications.length === 0 ? (
                                // Empty State
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <Clock className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        No notifications
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                                        {activeTab === "all"
                                            ? "You don't have any notifications yet."
                                            : `No ${activeTab} notifications.`}
                                    </p>
                                </div>
                            ) : (
                                // Grouped Notifications
                                <div className="space-y-6 sm:space-y-8">
                                    {Object.entries(groupedNotifications).map(
                                        ([group, notifs]) =>
                                            notifs.length > 0 && (
                                                <div key={group}>
                                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 sm:mb-4">
                                                        {group}
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {notifs.map((notification) => {
                                                            const styles = getTypeStyles(notification.type);
                                                            return (
                                                                <div
                                                                    key={notification.id}
                                                                    className={`relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors ${notification.read
                                                                        ? "bg-white border-gray-200"
                                                                        : `${styles.bg} ${styles.border}`
                                                                        } ${notification.link
                                                                            ? "cursor-pointer hover:shadow-sm"
                                                                            : ""
                                                                        }`}
                                                                    onClick={() => {
                                                                        if (
                                                                            notification.link &&
                                                                            !notification.read
                                                                        ) {
                                                                            handleMarkAsRead(notification.id);
                                                                        }
                                                                        // TODO: Navigate to notification.link
                                                                    }}
                                                                >
                                                                    {/* Unread Indicator */}
                                                                    {!notification.read && (
                                                                        <div className="absolute left-0 top-3 sm:top-4 w-1 h-10 sm:h-12 bg-primary rounded-r" />
                                                                    )}

                                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                        {/* Icon */}
                                                                        <div
                                                                            className={`flex w-10 h-10 items-center justify-center rounded-lg shrink-0 ${notification.read
                                                                                ? "bg-gray-100"
                                                                                : styles.iconBg
                                                                                }`}
                                                                        >
                                                                            <div
                                                                                className={
                                                                                    notification.read
                                                                                        ? "text-gray-600"
                                                                                        : styles.iconColor
                                                                                }
                                                                            >
                                                                                {notification.icon}
                                                                            </div>
                                                                        </div>

                                                                        {/* Content */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <h4 className="font-semibold text-sm text-foreground mb-1">
                                                                                {notification.title}
                                                                            </h4>
                                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                                {notification.message}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Actions Row */}
                                                                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0 pl-13 sm:pl-0">
                                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                            {formatTimestamp(notification.timestamp)}
                                                                        </span>

                                                                        {/* Actions */}
                                                                        {notification.read ? (
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        <MoreVertical className="h-4 w-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleMarkAsUnread(notification.id);
                                                                                        }}
                                                                                    >
                                                                                        <EyeOff className="h-4 w-4 mr-2" />
                                                                                        Mark unread
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem
                                                                                        className="text-red-600"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleDelete(notification.id);
                                                                                        }}
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        ) : (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDelete(notification.id);
                                                                                }}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}