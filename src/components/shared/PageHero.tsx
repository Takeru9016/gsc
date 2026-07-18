"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { SanityImageSource } from "@/lib/sanity/image.ts";
import { urlFor } from "@/lib/sanity/image.ts";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PageHeroMinHeight = "screen" | "60vh" | "50vh";

const minHeightClasses: Record<PageHeroMinHeight, string> = {
  "50vh": "min-h-[50vh]",
  "60vh": "min-h-[60vh]",
  screen: "min-h-screen",
};

interface PageHeroProps {
  badge?: string;
  children?: ReactNode;
  headline: string;
  image?: SanityImageSource;
  minHeight?: PageHeroMinHeight;
  subline?: string;
}

export function PageHero({
  headline,
  subline,
  badge,
  image,
  minHeight = "60vh",
  children,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = [
      badgeRef.current,
      headlineRef.current,
      sublineRef.current,
      childrenRef.current,
    ].filter((element): element is HTMLElement => element !== null);

    const ctx = gsap.context(() => {
      if (elements.length > 0) {
        gsap.from(elements, {
          duration: 0.6,
          ease: "power2.out",
          opacity: 0,
          stagger: 0.1,
          y: 30,
        });
      }

      if (sectionRef.current && contentRef.current) {
        gsap.to(contentRef.current, {
          ease: "none",
          opacity: 0,
          scrollTrigger: {
            end: "bottom top",
            scrub: true,
            start: "top top",
            trigger: sectionRef.current,
          },
          y: -30,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className={cn(
        "relative flex flex-col justify-center overflow-hidden pt-24 pb-16",
        minHeightClasses[minHeight]
      )}
      data-theme="dark"
      ref={sectionRef}
    >
      {image ? (
        <>
          <Image
            alt=""
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={urlFor(image).width(1920).height(1080).url()}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/0 via-bg-dark/40 to-bg-dark/80" />
        </>
      ) : (
        <div className="absolute inset-0 bg-bg-dark" />
      )}

      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        ref={contentRef}
      >
        {badge ? (
          <span
            className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary text-sm"
            ref={badgeRef}
          >
            {badge}
          </span>
        ) : null}
        <h1
          className="font-display text-(--color-text-primary) text-4xl uppercase tracking-wide md:text-6xl lg:text-7xl"
          ref={headlineRef}
        >
          {headline}
        </h1>
        {subline ? (
          <p
            className="mt-4 max-w-2xl text-(--color-text-secondary) text-lg"
            ref={sublineRef}
          >
            {subline}
          </p>
        ) : null}
        {children ? (
          <div className="mt-8 flex flex-wrap gap-4" ref={childrenRef}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
