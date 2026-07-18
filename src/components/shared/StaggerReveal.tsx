"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const REVEAL_THRESHOLD = 0.85;

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
}

export function StaggerReveal({ children, className }: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // If this setup runs while the section is already on screen (e.g. a
      // re-run triggered after the user has already scrolled past it), skip
      // the hide-then-reveal animation entirely rather than blanking
      // already-visible content.
      const alreadyInView =
        container.getBoundingClientRect().top <
        window.innerHeight * REVEAL_THRESHOLD;
      if (alreadyInView) {
        return;
      }

      // Card components carry `transition-all` for their own hover state.
      // That CSS transition fights GSAP's per-frame inline opacity/transform
      // writes during the reveal (the browser keeps re-targeting a fresh
      // 200ms transition every animation frame), so the element visually
      // never leaves its `opacity: 0` starting point even though the GSAP
      // tween itself completes normally. Suspend the CSS transition for the
      // duration of the reveal, then hand it back for hover to use.
      gsap.set(container.children, { transition: "none" });

      gsap.from(container.children, {
        duration: 0.5,
        onComplete: () => {
          gsap.set(container.children, { clearProps: "transition" });
        },
        opacity: 0,
        scrollTrigger: {
          once: true,
          start: "top 85%",
          trigger: container,
        },
        stagger: 0.08,
        y: 20,
      });
    },
    { scope: containerRef }
  );

  return (
    <div className={cn(className)} ref={containerRef}>
      {children}
    </div>
  );
}
