"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterRevealProps {
  children: ReactNode;
}

export function FooterReveal({ children }: FooterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
        duration: 0.6,
        ease: "power2.out",
        opacity: 0,
        scrollTrigger: {
          once: true,
          start: "top 90%",
          trigger: container,
        },
        y: 40,
      });
    });

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
