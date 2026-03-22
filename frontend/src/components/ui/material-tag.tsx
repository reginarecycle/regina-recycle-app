import { cn } from "@/lib/utils";

interface MaterialTagProps {
  material: string;
  size?: "sm" | "md";
  className?: string;
}

export function MaterialTag({ material, size = "md", className }: MaterialTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent-foreground text-primary-foreground text-xs font-semibold",
        size === "sm" ? "px-3 py-1" : "px-4 py-1.5",
        className
      )}
    >
      {material}
    </span>
  );
}
