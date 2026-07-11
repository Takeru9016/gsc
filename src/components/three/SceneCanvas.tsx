"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SceneCanvasCamera {
  far?: number;
  fov?: number;
  near?: number;
  position?: [number, number, number];
}

interface SceneCanvasProps {
  camera?: SceneCanvasCamera;
  children: ReactNode;
  className?: string;
  dpr?: [number, number];
}

const DEFAULT_CAMERA: SceneCanvasCamera = { fov: 75, position: [0, 0, 5] };

export function SceneCanvas({
  children,
  className,
  camera = DEFAULT_CAMERA,
  dpr = [1, 2],
}: SceneCanvasProps) {
  return (
    <ErrorBoundary fallback={null}>
      <Canvas
        camera={camera}
        className={className}
        dpr={dpr}
        gl={{ alpha: true, antialias: true }}
        style={{ inset: 0, position: "absolute" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
