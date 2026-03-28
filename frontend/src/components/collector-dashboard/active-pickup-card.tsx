import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate, formatTimeRange } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import type { CollectorPickup } from "@/api-hooks/useCollectors";

type Props = {
  pickup?:    CollectorPickup;
  isLoading?: boolean;
};

export function ActivePickupCard({ pickup, isLoading }: Props) {
  const navigate = useNavigate();

  const totalUnits = pickup?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const scheduledTime = pickup ? formatTimeRange(pickup.scheduledAt) : "";

  return (
    <div className="flex flex-1 flex-col w-full rounded-[16px] border border-[#E5E7EB] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4 md:h-[58px] md:px-6 md:py-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#000000]">Active Pickups</h3>
          <p className="text-[12px] text-[#999CA0]">Pickups you need to complete</p>
        </div>
        <button
          onClick={() => navigate(`${Routes.requests}?tab=accepted`)}
          className="flex items-center gap-1 bg-white text-[14px] font-semibold text-[#344E41] hover:text-[#618171]"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
        {isLoading ? (
          <div className="w-full space-y-3 animate-pulse">
            <div className="h-4 w-48 rounded bg-gray-100" />
            <div className="h-4 w-32 rounded bg-gray-100" />
            <div className="h-4 w-64 rounded bg-gray-100" />
          </div>
        ) : !pickup ? (
          <p className="text-sm text-[#9CA3AF]">No active pickups right now.</p>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-4">
              {/* Truck icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 18V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H5M15 18H9M19 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17V13.35C21.9996 13.1231 21.922 12.903 21.78 12.726L18.3 8.376C18.2065 8.25888 18.0878 8.16428 17.9528 8.0992C17.8178 8.03412 17.6699 8.00021 17.52 8H14"
                    stroke="#344E41"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 20C8.10457 20 9 19.1046 9 18C9 16.8954 8.10457 16 7 16C5.89543 16 5 16.8954 5 18C5 19.1046 5.89543 20 7 20Z" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-[#111827]">
                  Doorstep Pickup {pickup.requestNumber}
                </p>
                <p className="text-[12px] text-[#10131D]">
                  {formatDate(pickup.scheduledAt)} · {scheduledTime}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#111827]/75">
                  {pickup.requester && (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" fill="#344E41" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {pickup.requester.name}
                    </span>
                  )}
                  {pickup.address && (
                    <span className="flex min-w-0 items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2ZM12 11.5C11.337 11.5 10.7011 11.2366 10.2322 10.7678C9.76339 10.2989 9.5 9.66304 9.5 9C9.5 8.33696 9.76339 7.70107 10.2322 7.23223C10.7011 6.76339 11.337 6.5 12 6.5C12.663 6.5 13.2989 6.76339 13.7678 7.23223C14.2366 7.70107 14.5 8.33696 14.5 9C14.5 9.66304 14.2366 10.2989 13.7678 10.7678C13.2989 11.2366 12.663 11.5 12 11.5Z" fill="#344E41" />
                      </svg>
                      <span className="truncate">{pickup.address.line1}</span>
                    </span>
                  )}
                  {totalUnits > 0 && (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3.5 7.5H20.5V3.5H3.5V7.5ZM3.5 8.44434V19.999C3.5 20.4163 3.64189 20.7605 3.94141 21.0596C4.23963 21.3578 4.58354 21.5 5 21.5H19.001C19.4176 21.5 19.7616 21.358 20.0596 21.0596C20.3579 20.7606 20.5 20.4163 20.5 20V8.44238L20.2598 8.28687C20.025 8.1445 19.8394 7.96196 19.6982 7.73706C19.5705 7.53348 19.5 7.29006 19.5 6.99902V4C19.5 3.58404 19.3585 3.24037 19.0596 2.94141C18.7605 2.64234 18.4162 2.5 18 2.5H5.99902C5.58276 2.5 5.23852 2.64227 4.93945 2.94141C4.64065 3.2397 4.5 3.58381 4.5 4V7C4.5 7.301 4.42924 7.54449 4.30176 7.74707C4.16041 7.97158 3.97482 8.15487 3.73926 8.29883L3.5 8.44434Z" fill="#618171" stroke="#344E41" />
                      </svg>
                      {totalUnits} units
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigate(`${Routes.requests}?tab=accepted`)}
              className="flex w-full items-center justify-center gap-2 bg-[#163A24] text-white hover:bg-[#163A24]/90 md:w-[176px]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#163A24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Complete Pickup
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
