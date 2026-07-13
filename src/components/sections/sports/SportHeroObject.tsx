"use client";

import dynamic from "next/dynamic";
import { SceneCanvas } from "@/components/three/SceneCanvas.tsx";
import { WebGLOnly } from "@/components/three/WebGLDetector.tsx";

const CricketBall = dynamic(
  () =>
    import("@/components/three/objects/CricketBall.tsx").then(
      (mod) => mod.CricketBall
    ),
  { loading: () => null, ssr: false }
);
const Shuttlecock = dynamic(
  () =>
    import("@/components/three/objects/Shuttlecock.tsx").then(
      (mod) => mod.Shuttlecock
    ),
  { loading: () => null, ssr: false }
);
const TennisBall = dynamic(
  () =>
    import("@/components/three/objects/TennisBall.tsx").then(
      (mod) => mod.TennisBall
    ),
  { loading: () => null, ssr: false }
);
const WaterSphere = dynamic(
  () =>
    import("@/components/three/objects/WaterSphere.tsx").then(
      (mod) => mod.WaterSphere
    ),
  { loading: () => null, ssr: false }
);

const OBJECT_COMPONENTS = {
  "cricket-ball": CricketBall,
  shuttlecock: Shuttlecock,
  "tennis-ball": TennisBall,
  "water-sphere": WaterSphere,
} as const;

interface SportHeroObjectProps {
  threeObjectType: string;
}

export function SportHeroObject({ threeObjectType }: SportHeroObjectProps) {
  const ObjectComponent =
    OBJECT_COMPONENTS[threeObjectType as keyof typeof OBJECT_COMPONENTS];

  if (!ObjectComponent) {
    return null;
  }

  return (
    <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
      <WebGLOnly fallback={null}>
        <SceneCanvas camera={{ fov: 50, position: [0, 0, 3] }}>
          <ObjectComponent />
        </SceneCanvas>
      </WebGLOnly>
    </div>
  );
}
