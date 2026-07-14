import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  download?: boolean;
  external?: boolean;
  href?: string;
  loading?: boolean;
  onClick?: MouseEventHandler;
  size?: ButtonSize;
  type?: "button" | "reset" | "submit";
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-primary text-primary hover:bg-primary/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-w-[120px] px-6 py-3",
  sm: "px-4 py-2 text-sm",
};

export function Button({
  ariaLabel,
  children,
  className,
  disabled = false,
  download = false,
  external = false,
  href,
  loading = false,
  onClick,
  size = "md",
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      {loading ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : null}
      {children}
    </>
  );

  if (href) {
    if (download) {
      return (
        <a aria-label={ariaLabel} className={classes} download href={href}>
          {content}
        </a>
      );
    }
    if (external) {
      return (
        <a
          aria-label={ariaLabel}
          className={classes}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {content}
        </a>
      );
    }
    return (
      <Link aria-label={ariaLabel} className={classes} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button
      aria-label={ariaLabel}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {content}
    </button>
  );
}
