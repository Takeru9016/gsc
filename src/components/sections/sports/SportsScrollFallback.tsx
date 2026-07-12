"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import type { SportListItem } from "@/lib/sanity/queries.ts";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SportScene {
  accentColor: string;
  accentOpacity: number;
  categoryValue: string;
  key: string;
  label: string;
  overlayClassName: string;
}

// Default overlay keeps the accent tint clearly visible. Badminton's accent
// is near-white (#F9FAFB), which would wash out the light heading text at
// the default strength, so it gets a heavier scrim instead.
const DEFAULT_OVERLAY = "from-bg-dark/20 via-bg-dark/30 to-bg-dark/70";
const HEAVY_OVERLAY = "from-bg-dark/45 via-bg-dark/55 to-bg-dark/85";

// Mirrors the 6 WebGL scenes specced in docs/3D.md (Scenes 1–6), which will
// replace these sections one at a time in Tasks 3-05 through 3-08. Each scene
// maps to its closest sport.category value (docs/spec/SCHEMA.md `sport`) so
// the "X Sports" count reflects real Sanity data rather than a fixed number.
const SPORT_SCENES: SportScene[] = [
  {
    accentColor: "#FFB300",
    accentOpacity: 0.4,
    categoryValue: "outdoor",
    key: "cricket",
    label: "Cricket",
    overlayClassName: DEFAULT_OVERLAY,
  },
  {
    accentColor: "#1E88E5",
    accentOpacity: 0.4,
    categoryValue: "aquatic",
    key: "swimming",
    label: "Swimming",
    overlayClassName: DEFAULT_OVERLAY,
  },
  {
    accentColor: "#F9FAFB",
    accentOpacity: 0.22,
    categoryValue: "indoor",
    key: "badminton",
    label: "Badminton",
    overlayClassName: HEAVY_OVERLAY,
  },
  {
    accentColor: "#E8A020",
    accentOpacity: 0.4,
    categoryValue: "outdoor",
    key: "tennis",
    label: "Tennis",
    overlayClassName: DEFAULT_OVERLAY,
  },
  {
    accentColor: "#9333EA",
    accentOpacity: 0.4,
    categoryValue: "indoor",
    key: "squash",
    label: "Squash",
    overlayClassName: DEFAULT_OVERLAY,
  },
  {
    accentColor: "#E53935",
    accentOpacity: 0.4,
    categoryValue: "health",
    key: "gym",
    label: "Gym",
    overlayClassName: DEFAULT_OVERLAY,
  },
];

interface SportsScrollFallbackProps {
  sports: SportListItem[];
}

export function SportsScrollFallback({ sports }: SportsScrollFallbackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const countsByCategory = sports.reduce<Record<string, number>>(
    (counts, sport) => {
      counts[sport.category] = (counts[sport.category] ?? 0) + 1;
      return counts;
    },
    {}
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-scene-section]");

      for (const [index, section] of sections.entries()) {
        const heading = section.querySelector<HTMLElement>(
          "[data-scene-heading]"
        );
        const count = section.querySelector<HTMLElement>("[data-scene-count]");
        const background = section.querySelector<HTMLElement>(
          "[data-scene-background]"
        );

        if (reduceMotion) {
          continue;
        }

        if (heading) {
          gsap.from(heading, {
            duration: 0.6,
            ease: "power2.out",
            opacity: 0,
            scrollTrigger: {
              once: true,
              start: "top 85%",
              trigger: section,
            },
            y: 40,
          });
        }

        if (count) {
          gsap.from(count, {
            delay: 0.2,
            duration: 0.6,
            ease: "power2.out",
            opacity: 0,
            scrollTrigger: {
              once: true,
              start: "top 85%",
              trigger: section,
            },
          });
        }

        if (background) {
          gsap.fromTo(
            background,
            { scale: 1.05 },
            {
              ease: "none",
              scale: 1,
              scrollTrigger: {
                end: "+=100%",
                onToggle: (self) => {
                  if (self.isActive) {
                    setActiveIndex(index);
                  }
                },
                pin: true,
                scrub: true,
                start: "top top",
                trigger: section,
              },
            }
          );
        }
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-bg-dark" data-theme="dark" ref={containerRef}>
      {SPORT_SCENES.map((scene) => {
        const count = countsByCategory[scene.categoryValue] ?? 0;

        return (
          <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-center sm:px-6 lg:px-8"
            data-scene-section
            key={scene.key}
          >
            {/* [PENDING_CONTENT] — background image/video for the {scene.label} scene; replaced by a WebGL scene in Tasks 3-05 through 3-08 */}
            <div
              className="absolute inset-0"
              data-scene-background
              style={{
                backgroundColor: scene.accentColor,
                opacity: scene.accentOpacity,
              }}
            />
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-b",
                scene.overlayClassName
              )}
            />

            <div className="relative z-10">
              <h2
                className="font-display text-6xl text-text-primary uppercase tracking-wide md:text-7xl lg:text-8xl"
                data-scene-heading
              >
                {scene.label}
              </h2>
              <p
                className="mt-4 text-lg text-text-secondary md:text-xl"
                data-scene-count
              >
                {count} Sport{count === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        );
      })}

      <nav
        aria-hidden="true"
        className="fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-8"
      >
        {SPORT_SCENES.map((scene, index) => (
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full border border-white/30 transition-all duration-200",
              activeIndex === index
                ? "scale-125 border-transparent bg-primary"
                : "bg-transparent"
            )}
            key={scene.key}
          />
        ))}
      </nav>
    </div>
  );
}
