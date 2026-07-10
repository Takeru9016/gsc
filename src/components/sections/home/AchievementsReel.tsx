"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

const PLACEHOLDER_COUNT = 8;
const PLACEHOLDER_IDS = Array.from(
  { length: PLACEHOLDER_COUNT * 2 },
  (_, index) => `achievement-placeholder-${index}`
);

export function AchievementsReel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(track, {
        duration: 25,
        ease: "none",
        repeat: -1,
        xPercent: -50,
      });
    });

    return () => ctx.revert();
  }, []);

  const handlePause = useCallback(() => tweenRef.current?.pause(), []);
  const handleResume = useCallback(() => tweenRef.current?.resume(), []);

  return (
    <SectionWrapper noPadding={false}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Our Champions
        </AnimatedText>
        <Link
          className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-primary px-6 py-3 font-medium text-primary transition-all duration-200 hover:bg-primary/10"
          href="/achievements"
        >
          View All Achievements
        </Link>
      </div>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover-pause on a CSS marquee, content is fully accessible without it */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: same reasoning */}
      <div
        className="overflow-hidden"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <div className="flex w-max gap-4 md:gap-6" ref={trackRef}>
          {PLACEHOLDER_IDS.map((id) => (
            // [PENDING_CONTENT] — achievement image from Sanity
            <div
              className="aspect-square w-48 shrink-0 rounded-2xl bg-surface-dark md:w-64"
              key={id}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
