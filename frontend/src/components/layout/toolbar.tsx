import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { locations } from "@/constants/data";
import { MapPin, Bell, Settings, Menu } from "lucide-react";

interface ToolbarProps {
    currentLocation?: string;
    onLocationChange?: (location: string) => void;
    notificationCount?: number;
    pageTitle?: string;
    onMenuClick?: () => void;
}

export function Toolbar({
    currentLocation = "123-lane",
    onLocationChange,
    notificationCount = 0,
    pageTitle = "Dashboard",
    onMenuClick,
}: ToolbarProps) {
    return (
        <header className="sticky top-0 z-30 lg:z-50 flex h-16 items-center justify-between border-b bg-white dark:bg-gray-950 px-6">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="lg:hidden items-center justify-center rounded-full bg-card px-2 py-2"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Page Title */}
                <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                {/* Location Selector - Hidden on mobile */}
                <Select value={currentLocation} onValueChange={onLocationChange}>
                    <SelectTrigger className="hidden md:flex w-45 bg-card dark:bg-gray-900 rounded-full border-border">
                        <MapPin className="h-4 w-4" />
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((location) => (
                            <SelectItem key={location.value} value={location.value}>
                                {location.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Notification Button */}
                <Button variant="ghost" size="icon" className="relative text-black-800 bg-card rounded-full px-2 py-2">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                    )}
                </Button>

                {/* Settings Button */}
                <Button variant="ghost" size="icon" className="text-black-800 bg-card rounded-full px-2 py-2">
                    <Settings className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}