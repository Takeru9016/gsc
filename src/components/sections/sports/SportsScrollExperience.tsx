"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { SportListItem } from "@/lib/sanity/queries.ts";
import { SPORT_CATEGORIES } from "@/lib/sportCategories.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SportsScrollExperienceProps {
  sports: SportListItem[];
}

// [3D_UPGRADE] — This section will be replaced with WebGL in Task 3-04
// through 3-08. This GSAP + CSS version is the mobile-permanent experience
// and the desktop fallback until the WebGL scroll scenes ship in Phase 3.
export function SportsScrollExperience({
  sports,
}: SportsScrollExperienceProps) {
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
      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-category-section]"
      );

      for (const section of sections) {
        gsap.from(section, {
          duration: 0.7,
          ease: "power2.out",
          opacity: 0,
          scrollTrigger: {
            once: true,
            start: "top 80%",
            trigger: section,
          },
          y: 50,
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const countsByCategory = sports.reduce<Record<string, number>>(
    (counts, sport) => {
      counts[sport.category] = (counts[sport.category] ?? 0) + 1;
      return counts;
    },
    {}
  );

  return (
    <div className="bg-bg-dark" data-theme="dark" ref={containerRef}>
      {SPORT_CATEGORIES.map((category) => {
        const count = countsByCategory[category.value] ?? 0;

        return (
          <div
            className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8"
            data-category-section
            key={category.value}
          >
            {/* [PENDING_CONTENT] — category hero image/video from Sanity */}
            <div className="aspect-video w-full max-w-3xl rounded-2xl bg-surface-dark" />
            <div>
              <h2 className="font-display text-(--color-text-primary) text-5xl uppercase tracking-wide md:text-7xl">
                {category.label}
              </h2>
              <p className="mt-3 text-(--color-text-secondary) text-lg">
                {count} sport{count === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
