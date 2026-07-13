"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

const SCROLL_FADE_END = 0.5;

export function useHeroObjectFade(): RefObject<number> {
  const opacityRef = useRef(1);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      end: `${SCROLL_FADE_END * 100}% top`,
      onUpdate: (self) => {
        const progress = Math.min(self.progress / SCROLL_FADE_END, 1);
        opacityRef.current = 1 - progress;
      },
      scrub: true,
      start: "top top",
      trigger: document.body,
    });

    return () => trigger.kill();
  }, []);

  return opacityRef;
}
