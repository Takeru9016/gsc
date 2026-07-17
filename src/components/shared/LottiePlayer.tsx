"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils.ts";

interface LottiePlayerProps {
  autoplay?: boolean;
  className?: string;
  loop?: boolean;
  speed?: number;
  src: object;
}

export function LottiePlayer({
  src,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
}: LottiePlayerProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    lottieRef.current?.setSpeed(speed);
  }, [speed]);

  return (
    <Lottie
      animationData={src}
      autoplay={autoplay}
      className={cn("h-full w-full", className)}
      loop={loop}
      lottieRef={lottieRef}
      rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
    />
  );
}
