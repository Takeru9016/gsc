"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function HeroSection() {
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

    if (elements.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        duration: 0.7,
        ease: "power2.out",
        opacity: 0,
        stagger: 0.15,
        y: 30,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24"
      data-theme="dark"
    >
      <div className="absolute inset-0 bg-bg-dark" />
      {/* [PENDING_3D_HERO] — WebGL particle scene lands in Phase 3; CSS fallback here */}
      <div className="hero-particles absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-b from-bg-dark/0 via-bg-dark/20 to-bg-dark" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span
          className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary text-sm"
          ref={badgeRef}
        >
          Mumbai's Premier Sports Destination
        </span>
        <h1
          className="max-w-4xl font-display text-6xl text-text-primary-dark uppercase tracking-wide md:text-8xl lg:text-[96px]"
          ref={headlineRef}
        >
          Goregaon Sports Club
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-text-secondary-dark"
          ref={sublineRef}
        >
          Mumbai's Premier Sports Destination — 30+ Years, 23+ Sports, 40,000+
          Members
        </p>
        <div className="mt-10 flex flex-wrap gap-4" ref={ctaRef}>
          <Link
            className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
            href="/membership"
          >
            Explore Membership
          </Link>
          <Link
            className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-primary px-6 py-3 font-medium text-primary transition-all duration-200 hover:bg-primary/10"
            href="/facilities"
          >
            View Facilities
          </Link>
        </div>
      </div>
    </section>
  );
}
