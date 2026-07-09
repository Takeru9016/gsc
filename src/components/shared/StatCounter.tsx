"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCounterProps {
  className?: string;
  duration?: number;
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
}

export function StatCounter({
  value,
  suffix,
  prefix,
  label,
  duration = 1.5,
  className,
}: StatCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counter.textContent = String(value);
      return;
    }

    counter.textContent = "0";

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        duration,
        ease: "power1.out",
        scrollTrigger: {
          once: true,
          start: "top 85%",
          trigger: counter,
        },
        snap: { textContent: 1 },
        textContent: value,
      });
    });

    return () => ctx.revert();
  }, [value, duration]);

  return (
    <div className={cn("text-center", className)}>
      <p className="font-display text-4xl text-primary md:text-5xl">
        {prefix}
        <span ref={counterRef}>0</span>
        {suffix}
      </p>
      <p className="mt-2 text-(--color-text-secondary) text-sm">{label}</p>
    </div>
  );
}
