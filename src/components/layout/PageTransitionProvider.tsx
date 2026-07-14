"use client";

import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname retriggers the fade on route change, it is not read in the effect body
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(container, {
        duration: 0.4,
        ease: "power2.out",
        opacity: 0,
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  return <div ref={containerRef}>{children}</div>;
}
