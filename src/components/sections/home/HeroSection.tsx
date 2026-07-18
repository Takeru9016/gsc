"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/shared/Button.tsx";
import type { SiteConfig } from "@/lib/sanity/queries.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FALLBACK_VIDEO_URL = "/videos/gsc-hero.mp4";

interface HeroSectionProps {
  siteConfig: SiteConfig;
}

export function HeroSection({ siteConfig }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = [
      badgeRef.current,
      headlineRef.current,
      sublineRef.current,
      ctaRef.current,
    ].filter((element): element is HTMLElement => element !== null);

    const ctx = gsap.context(() => {
      if (elements.length > 0) {
        gsap.from(elements, {
          duration: 0.7,
          ease: "power2.out",
          opacity: 0,
          stagger: 0.15,
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

  const videoUrl = siteConfig.heroVideoUrl ?? FALLBACK_VIDEO_URL;

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24"
      data-theme="dark"
      ref={sectionRef}
    >
      {/* [PENDING_CONTENT] — hero-poster.jpg is a solid-color placeholder. Replace with the first frame of the hero video. */}
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster="/images/hero-poster.jpg"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-b from-bg-dark/60 via-bg-dark/50 to-bg-dark/80" />

      <div
        className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        ref={contentRef}
      >
        <span
          className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary text-sm"
          ref={badgeRef}
        >
          Mumbai's Premier Sports Destination
        </span>
        <h1
          className="font-display text-6xl text-text-primary-dark uppercase tracking-wide md:text-8xl lg:text-[96px]"
          ref={headlineRef}
        >
          Goregaon Sports Club
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary-dark"
          ref={sublineRef}
        >
          Mumbai's Premier Sports Destination — 30+ Years, 23+ Sports, 40,000+
          Members
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4" ref={ctaRef}>
          <Button href="/membership">Explore Membership</Button>
          <Button href="/facilities" variant="secondary">
            View Facilities
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown aria-hidden="true" className="size-6 text-white/50" />
      </div>
    </section>
  );
}
