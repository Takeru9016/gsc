"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimatedTextTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface AnimatedTextProps {
  as?: AnimatedTextTag;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedText({
  children,
  as: Tag = "p",
  delay = 0,
  className,
}: AnimatedTextProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(element, {
        delay,
        duration: 0.6,
        ease: "power2.out",
        opacity: 0,
        scrollTrigger: {
          once: true,
          start: "top 85%",
          trigger: element,
        },
        y: 30,
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag className={cn(className)} ref={setRef}>
      {children}
    </Tag>
  );
}
