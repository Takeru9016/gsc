"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARTICLE_COUNT = 50;
const GOLD_RATIO = 0.2;

interface Particle {
  color: string;
  delay: number;
  duration: number;
  id: number;
  left: number;
  maxOpacity: number;
  minOpacity: number;
  size: number;
  top: number;
  xDrift: number;
  yDrift: number;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    color:
      Math.random() < GOLD_RATIO
        ? "var(--color-accent-gold)"
        : "var(--color-primary)",
    delay: randomBetween(0, 2),
    duration: randomBetween(3, 8),
    id,
    left: randomBetween(0, 100),
    maxOpacity: 0.8,
    minOpacity: 0.3,
    size: randomBetween(2, 8),
    top: randomBetween(0, 100),
    xDrift: randomBetween(-10, 10),
    yDrift: randomBetween(-20, 20),
  }));
}

export function HeroFallback() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Stable per-index ref callbacks — an inline arrow in the JSX below would
  // be recreated every render.
  const setParticleRef = useMemo(
    () =>
      Array.from(
        { length: PARTICLE_COUNT },
        (_, index) => (element: HTMLSpanElement | null) => {
          particleRefs.current[index] = element;
        }
      ),
    []
  );
  // Particles are generated client-side only — Math.random() during SSR
  // would produce a markup mismatch on hydration.
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(createParticles());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!(container && particles.length)) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        for (const [index, particle] of particles.entries()) {
          const element = particleRefs.current[index];
          if (!element) {
            continue;
          }
          gsap.to(element, {
            delay: particle.delay,
            duration: particle.duration,
            ease: "sine.inOut",
            opacity: particle.maxOpacity,
            repeat: -1,
            x: particle.xDrift,
            y: particle.yDrift,
            yoyo: true,
          });
        }
      }

      gsap.to(container, {
        ease: "none",
        opacity: 0,
        scrollTrigger: {
          end: "bottom top",
          scrub: true,
          start: "top top",
          trigger: container,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [particles]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      ref={containerRef}
    >
      {particles.map((particle, index) => (
        <span
          className="absolute rounded-full"
          key={particle.id}
          ref={setParticleRef[index]}
          style={{
            backgroundColor: particle.color,
            height: particle.size,
            left: `${particle.left}%`,
            opacity: particle.minOpacity,
            top: `${particle.top}%`,
            width: particle.size,
          }}
        />
      ))}
    </div>
  );
}
