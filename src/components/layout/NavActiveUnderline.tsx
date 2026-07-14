"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export function NavActiveUnderline() {
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const underline = underlineRef.current;
    if (!underline) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        underline,
        { scaleX: 0 },
        { duration: 0.3, ease: "power2.out", scaleX: 1 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <span
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
      ref={underlineRef}
    />
  );
}
