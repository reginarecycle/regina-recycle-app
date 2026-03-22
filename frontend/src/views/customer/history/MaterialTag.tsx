import * as React from "react";
import type { MaterialType } from "./types.tsx";

interface MaterialTagProps {
  material: MaterialType;
  size?: "sm" | "md";
}

export const MaterialTag: React.FC<MaterialTagProps> = ({ material, size = "md" }) => (
  <span
    className={
      size === "sm"
        ? "inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
        : "inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
    }
  >
    {material}
  </span>
);