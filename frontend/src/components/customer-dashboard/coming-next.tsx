import { MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TruckIcon from "@/assets/truck-icon.svg";
import { useRouter } from "@/routes/hooks/use-router";
import { Routes } from "@/routes/routes";

type Props = {
  pickup?: string;
  date?: string;
  time?: string;
  address?: string;
  bagNumber?: number;
};

export function ComingNext({
  pickup = "Doorstep Pickup",
  date = "Jan. 25, 2026",
  time = "9:00AM - 11:00AM",
  address = "123 Lane, Str.",
  bagNumber = 3,
}: Props) {
  const router = useRouter();

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
                <span className="mx-2 inline-block w-1 h-1 rounded-full bg-muted-foreground align-middle" />
                {time}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {address}
                </span>
                <span className="hidden sm:block w-px h-4 bg-border" />
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  {bagNumber} bags
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="destructiveoutline"
            size='lg'
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
