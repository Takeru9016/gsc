"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Badge } from "@/components/shared/Badge.tsx";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface AdminStatCardProps {
  className?: string;
  href: string;
  icon: ReactNode;
  isPending?: boolean;
  label: string;
  value: number;
}

export function AdminStatCard({
  className,
  href,
  icon,
  isPending = false,
  label,
  value,
}: AdminStatCardProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const showAsNew = isPending && value > 0;

  useGSAP(() => {
    const counter = counterRef.current;
    if (!counter) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counter.textContent = String(value);
      return;
    }

    counter.textContent = "0";
    gsap.to(counter, {
      duration: 1,
      ease: "power1.out",
      snap: { textContent: 1 },
      textContent: value,
    });
  }, [value]);

  return (
    <Link
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:border-primary/40",
        className
      )}
      href={href}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          showAsNew
            ? "bg-accent-gold/10 text-accent-gold"
            : "bg-primary/10 text-primary"
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-display font-semibold text-3xl",
              showAsNew ? "text-accent-gold" : "text-(--color-text-primary)"
            )}
            ref={counterRef}
          >
            0
          </span>
          {showAsNew ? (
            <Badge size="sm" variant="gold">
              New
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 truncate text-(--color-text-secondary) text-sm">
          {label}
        </p>
      </div>
    </Link>
  );
}
