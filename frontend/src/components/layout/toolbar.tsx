import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Bell, Settings } from "lucide-react";

interface ToolbarProps {
  currentLocation?: string;
  onLocationChange?: (location: string) => void;
  notificationCount?: number;
}

const locations = [
  { value: "123-lane", label: "123 Lane, Str." },
  { value: "456-avenue", label: "456 Avenue, Blvd." },
  { value: "789-road", label: "789 Road, Cres." },
];

export function Toolbar({
  currentLocation = "123-lane",
  onLocationChange,
  notificationCount = 0,
}: ToolbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
      {/* Location Selector */}
      <Select value={currentLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[200px]">
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
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Button>

      {/* Settings Button */}
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
}
