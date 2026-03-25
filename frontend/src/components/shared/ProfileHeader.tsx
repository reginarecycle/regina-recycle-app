import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileHeaderProps {
  avatarSrc?: string;
  avatarFallback: string;
  name: string;
  badge: string;
  memberSince: string;
  badgeVariant?: "success" | "default" | "destructive" | "outline";
  isLoading?: boolean;
}

export function ProfileHeader({
  avatarSrc,
  avatarFallback,
  name,
  badge,
  memberSince,
  badgeVariant = "success",
  isLoading = false,
}: ProfileHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        {isLoading ? (
          <Skeleton className="h-20 w-20 sm:h-32 sm:w-32 rounded-full shrink-0" />
        ) : (
          <Avatar className="h-20 w-20 sm:h-32 sm:w-32 border-4 border-green-100 shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
            <AvatarFallback className="bg-green-100/50 text-green-600 text-4xl sm:text-4xl font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col min-w-0 gap-2">
          {isLoading ? (
            <>
              <Skeleton className="h-7 w-48 sm:h-10 sm:w-64" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="flex flex-col items-start md:flex-row md:items-center gap-2">
                <p className="text-xl sm:text-4xl font-bold">{name}</p>
                <Badge
                  variant={badgeVariant}
                  className="inline-flex px-2 py-1 items-center rounded-[34px] border border-green-00 bg-green-100 text-[10px] sm:text-xs whitespace-nowrap"
                >
                  {badge}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">{memberSince}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}