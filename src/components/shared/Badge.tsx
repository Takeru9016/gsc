import type { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

type BadgeVariant = "primary" | "gold" | "red" | "green" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: "border border-accent-gold/20 bg-accent-gold/10 text-accent-gold",
  green: "border border-accent-green/20 bg-accent-green/10 text-accent-green",
  outline: "border border-border-dark text-(--color-text-secondary)",
  primary: "border border-primary/20 bg-primary/10 text-primary",
  red: "border border-accent-red/20 bg-accent-red/10 text-accent-red",
};

const sizeClasses: Record<BadgeSize, string> = {
  md: "px-3 py-1 text-sm",
  sm: "px-2.5 py-0.5 text-xs",
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
