"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LottieScenePlayer,
  type LottieSport,
} from "@/components/sections/sports/LottieScenePlayer.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { SportListItem } from "@/lib/sanity/queries.ts";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SportScene {
  accent: string;
  key: string;
  lottie: LottieSport;
  matchKeywords: string[];
  name: string;
  stat: string;
}

const SPORT_SCENES: SportScene[] = [
  {
    accent: "#FFB300",
    key: "cricket",
    lottie: "cricket",
    matchKeywords: ["cricket"],
    name: "Cricket",
    stat: "3 formats",
  },
  {
    accent: "#1E88E5",
    key: "swimming",
    lottie: "swimming",
    matchKeywords: ["swim", "pool"],
    name: "Swimming",
    stat: "Olympic pool",
  },
  {
    accent: "#F9FAFB",
    key: "badminton",
    lottie: "badminton",
    matchKeywords: ["badminton"],
    name: "Badminton",
    stat: "12 courts",
  },
  {
    accent: "#E8A020",
    key: "tennis",
    lottie: "tennis",
    matchKeywords: ["tennis", "lawn"],
    name: "Lawn Tennis",
    stat: "4 courts",
  },
  {
    accent: "#9333EA",
    key: "squash",
    lottie: "squash",
    matchKeywords: ["squash"],
    name: "Squash",
    stat: "4 courts",
  },
  {
    accent: "#E53935",
    key: "gym",
    lottie: "gym",
    matchKeywords: ["health", "gym", "fitness"],
    name: "Health Club",
    stat: "3 centres",
  },
];

interface IndexedRefs<T> {
  current: (T | null)[];
}

function useIndexedRefCallbacks<T>(
  refs: IndexedRefs<T>,
  count: number
): ((element: T | null) => void)[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, index) => (element: T | null) => {
        refs.current[index] = element;
      }),
    [refs, count]
  );
}

function findSport(
  sports: SportListItem[],
  scene: SportScene
): SportListItem | undefined {
  return sports.find((sport) => {
    const name = sport.name.toLowerCase();
    return scene.matchKeywords.some((keyword) => name.includes(keyword));
  });
}

function SceneBackground({
  scene,
  sport,
  priority,
}: {
  priority: boolean;
  scene: SportScene;
  sport: SportListItem | undefined;
}) {
  if (sport?.heroImage) {
    return (
      <>
        <Image
          alt=""
          className="object-cover"
          fill
          priority={priority}
          sizes="100vw"
          src={urlFor(sport.heroImage).width(1920).url()}
        />
        <div className="absolute inset-0 bg-bg-dark/70" />
      </>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-bg-dark"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${scene.accent}33, transparent 60%)`,
      }}
    />
  );
}

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(query.matches);

    const listener = (event: MediaQueryListEvent) =>
      setIsDesktop(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return isDesktop;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);

    const listener = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}

interface SportsScrollProps {
  sports: SportListItem[];
}

function SportsScrollDesktop({ sports }: SportsScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const panelRefCallbacks = useIndexedRefCallbacks(
    panelRefs,
    SPORT_SCENES.length
  );
  const dotRefCallbacks = useIndexedRefCallbacks(dotRefs, SPORT_SCENES.length);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const panels = panelRefs.current.filter(
      (panel): panel is HTMLDivElement => panel !== null
    );

    if (!(container && track) || panels.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      const panelCount = panels.length;

      const master = gsap.to(track, {
        ease: "none",
        scrollTrigger: {
          end: () => `+=${(panelCount - 1) * window.innerWidth}`,
          onUpdate: (self) => {
            const activeIndex = Math.round(self.progress * (panelCount - 1));
            for (const [index, dot] of dotRefs.current.entries()) {
              dot?.classList.toggle("active", index === activeIndex);
            }
          },
          pin: true,
          scrub: 1,
          snap: 1 / (panelCount - 1),
          trigger: container,
        },
        // x (pixels), not xPercent — xPercent is relative to the track's own
        // width (panelCount * 100vw), so -100 * (panelCount - 1) overshoots
        // by a factor of panelCount, flying past every panel after Cricket.
        x: () => -(panelCount - 1) * window.innerWidth,
      });

      for (const panel of panels) {
        const number = panel.querySelector<HTMLElement>("[data-panel-number]");
        const heading = panel.querySelector<HTMLElement>(
          "[data-panel-heading]"
        );

        if (number) {
          gsap.from(number, {
            duration: 0.5,
            ease: "power2.out",
            opacity: 0,
            scrollTrigger: {
              containerAnimation: master,
              once: true,
              start: "left 80%",
              trigger: panel,
            },
            y: 20,
          });
        }

        if (heading) {
          gsap.from(heading, {
            delay: 0.1,
            duration: 0.6,
            ease: "power2.out",
            opacity: 0,
            scrollTrigger: {
              containerAnimation: master,
              once: true,
              start: "left 80%",
              trigger: panel,
            },
            y: 40,
          });
        }
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {SPORT_SCENES.map((scene, index) => (
          <span
            className={cn(
              "h-2 w-2 rounded-full border border-white/50 transition-all duration-300 [&.active]:scale-125 [&.active]:bg-white",
              index === 0 && "active"
            )}
            key={scene.key}
            ref={dotRefCallbacks[index]}
          />
        ))}
      </div>

      <div className="h-screen overflow-hidden">
        <div className="flex h-full" ref={trackRef}>
          {SPORT_SCENES.map((scene, index) => {
            const sport = findSport(sports, scene);

            return (
              <div
                className="relative flex h-full shrink-0 items-center"
                data-theme="dark"
                key={scene.key}
                ref={panelRefCallbacks[index]}
                style={{ width: "100vw" }}
              >
                <SceneBackground
                  priority={index === 0}
                  scene={scene}
                  sport={sport}
                />

                <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                  <div>
                    <p
                      className="font-body text-sm uppercase tracking-widest"
                      data-panel-number
                      style={{ color: scene.accent }}
                    >
                      {`0${index + 1} / 06`}
                    </p>
                    <h2
                      className="mt-4 font-display text-6xl text-text-primary-dark uppercase leading-none tracking-wide md:text-7xl lg:text-8xl"
                      data-panel-heading
                    >
                      {scene.name}
                    </h2>
                    <p className="mt-6 text-text-secondary-dark text-xl">
                      {scene.stat}
                    </p>
                    <Button
                      className="mt-8"
                      href={sport ? `/sports/${sport.slug}` : "/sports"}
                    >
                      Explore {scene.name}
                    </Button>
                  </div>

                  <div className="hidden items-center justify-center lg:flex">
                    <div className="h-80 w-80">
                      <LottieScenePlayer sport={scene.lottie} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SportsScrollMobile({ sports }: SportsScrollProps) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefCallbacks = useIndexedRefCallbacks(
    sectionRefs,
    SPORT_SCENES.length
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const sections = sectionRefs.current.filter(
      (section): section is HTMLDivElement => section !== null
    );

    if (sections.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      for (const section of sections) {
        const content = section.querySelector<HTMLElement>(
          "[data-mobile-content]"
        );

        if (!content) {
          continue;
        }

        gsap.from(content, {
          duration: 0.6,
          ease: "power2.out",
          opacity: 0,
          scrollTrigger: {
            once: true,
            start: "top 85%",
            trigger: section,
          },
          y: 30,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative">
      {SPORT_SCENES.map((scene, index) => {
        const sport = findSport(sports, scene);

        return (
          <div
            className="relative flex min-h-screen items-center overflow-hidden px-4 py-20 sm:px-6"
            data-theme="dark"
            key={scene.key}
            ref={sectionRefCallbacks[index]}
          >
            <SceneBackground
              priority={index === 0}
              scene={scene}
              sport={sport}
            />

            <div className="relative z-10 mx-auto max-w-lg" data-mobile-content>
              <p
                className="font-body text-sm uppercase tracking-widest"
                style={{ color: scene.accent }}
              >
                {`0${index + 1} / 06`}
              </p>
              <h2 className="mt-4 font-display text-5xl text-text-primary-dark uppercase leading-none tracking-wide">
                {scene.name}
              </h2>
              <p className="mt-4 text-lg text-text-secondary-dark">
                {scene.stat}
              </p>
              <Button
                className="mt-6"
                href={sport ? `/sports/${sport.slug}` : "/sports"}
              >
                Explore {scene.name}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SportsScroll({ sports }: SportsScrollProps) {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll-jacking horizontal pin is itself a motion-heavy interaction, not
  // just an animation, so reduced-motion users get the stacked layout
  // regardless of viewport width.
  if (!isDesktop || prefersReducedMotion) {
    return <SportsScrollMobile sports={sports} />;
  }

  return <SportsScrollDesktop sports={sports} />;
}
