"use client";

import {
  CircleDot,
  CircleDotDashed,
  Dumbbell,
  type LucideIcon,
  Target,
  Volleyball,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LottiePlayer } from "@/components/shared/LottiePlayer.tsx";
import { cn } from "@/lib/utils.ts";

export type LottieSport =
  | "cricket"
  | "swimming"
  | "badminton"
  | "tennis"
  | "squash"
  | "gym";

interface LottieScenePlayerProps {
  className?: string;
  sport: LottieSport;
}

const FALLBACK_ICONS: Record<LottieSport, LucideIcon> = {
  badminton: Volleyball,
  cricket: CircleDot,
  gym: Dumbbell,
  squash: Target,
  swimming: Waves,
  tennis: CircleDotDashed,
};

export function LottieScenePlayer({
  sport,
  className,
}: LottieScenePlayerProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setAnimationData(null);
    setHasError(false);

    fetch(`/lottie/${sport}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Missing Lottie animation for "${sport}"`);
        }
        return response.json() as Promise<object>;
      })
      .then((data) => {
        if (!isCancelled) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [sport]);

  const FallbackIcon = FALLBACK_ICONS[sport];

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-(--color-text-secondary)",
          className
        )}
      >
        <FallbackIcon
          aria-hidden="true"
          className="h-16 w-16"
          strokeWidth={1.25}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "opacity-0 transition-opacity duration-300",
        animationData ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {animationData ? <LottiePlayer src={animationData} /> : null}
    </div>
  );
}
