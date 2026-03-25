import { MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TruckIcon from "@/assets/truck-icon.svg";
import { useRouter } from "@/routes/hooks/use-router";
import { Routes } from "@/routes/routes";

type Props = {
  pickup?:    string;
  date?:      string;
  time?:      string;
  address?:   string;
  bagNumber?: number;
  pickupId?:  string;
};

export function ComingNext({
  pickup    = "No upcoming pickup",
  date      = "",
  time      = "",
  address   = "",
  bagNumber = 0,
  pickupId,
}: Props) {
  const router = useRouter();

  if (!pickupId) {
    return (
      <Card className="w-full rounded-xl border border-border bg-white shadow-none overflow-hidden py-4!">
        <CardHeader className="border-b border-border px-6 py-1!">
          <p className="text-sm font-semibold text-foreground">Coming up next</p>
        </CardHeader>
        <CardContent className="px-5 sm:px-6 py-4">
          <p className="text-sm text-muted-foreground">No upcoming pickups scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-xl border border-border bg-white shadow-none overflow-hidden py-4!">
      <CardHeader className="border-b border-border px-6 py-1!">
        <p className="text-sm font-semibold text-foreground">Coming up next</p>
      </CardHeader>

      <CardContent className="px-5 sm:px-6 py-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img src={TruckIcon} alt="Truck" className="w-16 h-16 shrink-0" />
            <div>
              <p className="text-base font-semibold text-foreground">{pickup}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {date}
                {time && (
                  <>
                    <span className="mx-2 inline-block w-1 h-1 rounded-full bg-muted-foreground align-middle" />
                    {time}
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                {address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {address}
                  </span>
                )}
                {bagNumber > 0 && (
                  <>
                    <span className="hidden sm:block w-px h-4 bg-border" />
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      {bagNumber} bags
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="destructiveoutline"
            size="lg"
            onClick={() => router.push(Routes.schedulePickup)}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComingNext;