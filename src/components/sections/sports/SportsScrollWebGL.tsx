"use client";

import dynamic from "next/dynamic";
import { WebGLOnly } from "@/components/three/WebGLDetector.tsx";
import type { SportListItem } from "@/lib/sanity/queries.ts";
import { SportsScrollFallback } from "./SportsScrollFallback.tsx";

const SportsScroll = dynamic(
  () =>
    import("@/components/three/SportsScroll.tsx").then(
      (mod) => mod.SportsScroll
    ),
  {
    loading: () => null,
    ssr: false,
  }
);

interface SportsScrollWebGLProps {
  sports: SportListItem[];
}

export function SportsScrollWebGL({ sports }: SportsScrollWebGLProps) {
  return (
    <WebGLOnly fallback={<SportsScrollFallback sports={sports} />}>
      <SportsScroll />
    </WebGLOnly>
  );
}
