import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  avatarSrc?: string;
  avatarFallback: string;
  name: string;
  badge: string;
  memberSince: string;
  /** Badge variant — defaults to "success" */
  badgeVariant?: "success" | "default" | "destructive" | "outline";
}

export function ProfileHeader({
  avatarSrc,
  avatarFallback,
  name,
  badge,
  memberSince,
  badgeVariant = "success",
}: ProfileHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex items-start gap-4 sm:gap-6">
        <Avatar className="h-20 w-20 sm:h-32 sm:w-32 border-4 border-green-100 shrink-0">
          {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
          <AvatarFallback className="bg-green-100 text-green-600 text-2xl sm:text-3xl font-semibold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-4xl font-bold mb-2">{name}</h1>
          <Badge
            variant={badgeVariant}
            className="inline-flex px-2 py-1 items-center rounded-[34px] border border-green-800 bg-green-100 text-[10px] sm:text-xs whitespace-nowrap mb-2"
          >
            {badge}
          </Badge>
          <p className="text-muted-foreground text-sm sm:text-base">{memberSince}</p>
        </div>
      </div>
    </div>
  );
}
