import type { CSSProperties } from "react";
import type { CategoryDef } from "@/config/categories";
import { cn } from "@/lib/cn";

interface CategoryBadgeProps {
  category: CategoryDef;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  style?: CSSProperties;
}

const sizes = {
  sm: { box: "size-12 border-[3px]", icon: "size-7", label: "text-xs" },
  md: { box: "size-16 border-4", icon: "size-9", label: "text-sm" },
  lg: { box: "size-28 border-[6px]", icon: "size-16", label: "text-xl" },
} as const;

/** Medallón circular con el ícono y el color de la categoría. */
export function CategoryBadge({ category, size = "md", showLabel = false, className, style }: CategoryBadgeProps) {
  const s = sizes[size];
  const { Icon } = category;
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)} style={style}>
      <div
        className={cn("grid place-items-center rounded-full text-white", s.box)}
        style={{
          borderColor: "#fbf0d9",
          background: `radial-gradient(circle at 35% 30%, ${category.colorLight} 0%, ${category.color} 45%, ${category.colorDark} 100%)`,
          boxShadow: `0 5px 0 ${category.colorDark}, 0 10px 18px -6px rgba(0,0,0,.55)`,
        }}
      >
        <Icon className={cn(s.icon, "drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]")} />
      </div>
      {showLabel ? (
        <span className={cn("font-display uppercase tracking-wide text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]", s.label)}>
          {category.label}
        </span>
      ) : null}
    </div>
  );
}
