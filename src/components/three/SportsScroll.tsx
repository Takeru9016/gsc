"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type MouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  DirectionalLight,
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial as MeshStandardMaterialType,
} from "three";
import { DoubleSide, Object3D, SphereGeometry } from "three";
import { SceneCanvas } from "@/components/three/SceneCanvas.tsx";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCENE_COUNT = 6;
const SCENE_LABELS = [
  "Cricket",
  "Swimming",
  "Badminton",
  "Tennis",
  "Squash",
  "Gym",
];
const PIN_LENGTH_PERCENT = SCENE_COUNT * 100;

const CAMERA_POSITION: [number, number, number] = [0, -1, 4];

const GOLD_LIGHT_COLOR = "#FFB300";
const BLUE_LIGHT_COLOR = "#1E88E5";
const AMBIENT_LIGHT_COLOR = "#111827";

const GROUND_COLOR = "#8B6914";
const STUMP_COLOR = "#FFFFFF";
const STUMP_POSITIONS: [number, number, number][] = [
  [-0.1, 0.3, 0],
  [0, 0.3, 0],
  [0.1, 0.3, 0],
];

const DUST_PARTICLE_COUNT = 200;
const DUST_COLOR = "#C4A35A";
const DUST_DRIFT_SPEED = 0.06;
const DUST_MAX_HEIGHT = 2;
const DUST_SPREAD_X = 6;
const DUST_SPREAD_Z = 5;
const DUST_MAX_OPACITY = 0.6;

const dummy = new Object3D();

type OpacityRef = RefObject<{ value: number }>;

interface DustParticleData {
  baseY: number;
  speed: number;
  x: number;
  z: number;
}

function buildDustParticles(): DustParticleData[] {
  const particles: DustParticleData[] = [];

  for (let i = 0; i < DUST_PARTICLE_COUNT; i += 1) {
    particles.push({
      baseY: Math.random() * DUST_MAX_HEIGHT,
      speed: DUST_DRIFT_SPEED * (0.5 + Math.random()),
      x: (Math.random() - 0.5) * DUST_SPREAD_X,
      z: (Math.random() - 0.5) * DUST_SPREAD_Z,
    });
  }

  return particles;
}

function DustParticles({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<InstancedMesh>(null);
  const particles = useMemo(() => buildDustParticles(), []);
  const geometry = useMemo(() => new SphereGeometry(0.015, 6, 6), []);

  useEffect(() => {
    const currentGeometry = geometry;
    return () => {
      currentGeometry.dispose();
    };
  }, [geometry]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const time = clock.getElapsedTime();
    const opacity = opacityRef.current.value;

    for (const [index, particle] of particles.entries()) {
      const y = (particle.baseY + time * particle.speed) % DUST_MAX_HEIGHT;
      dummy.position.set(particle.x, y, particle.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshStandardMaterialType;
    material.opacity = opacity * DUST_MAX_OPACITY;
  });

  return (
    <instancedMesh
      // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
      args={[geometry, undefined, DUST_PARTICLE_COUNT]}
      ref={meshRef}
    >
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshStandardMaterial color={DUST_COLOR} transparent />
    </instancedMesh>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

function CricketGround({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

  // The spec's camera sits below the plane (y: -1 vs plane y: 0), so the
  // default front-face culling would hide the top face entirely; DoubleSide
  // keeps it visible from this low angle.
  useEffect(() => {
    const material = meshRef.current?.material as
      | MeshStandardMaterialType
      | undefined;
    if (material) {
      material.side = DoubleSide;
    }
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const opacity = opacityRef.current.value;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshStandardMaterialType;
    material.opacity = opacity;
  });

  return (
    // biome-ignore lint/suspicious/noUnknownAttribute: "rotation" is a valid react-three-fiber intrinsic prop, not a DOM attribute
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <planeGeometry args={[10, 10]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshStandardMaterial color={GROUND_COLOR} transparent />
    </mesh>
  );
}

function CricketStumps({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const opacity = opacityRef.current.value;
    for (const mesh of meshRefs.current) {
      if (!mesh) {
        continue;
      }
      mesh.visible = opacity > 0.001;
      const material = mesh.material as MeshStandardMaterialType;
      material.opacity = opacity;
    }
  });

  const setStumpRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      meshRefs.current[index] = el;
      el?.position.set(...STUMP_POSITIONS[index]);
    },
    []
  );

  return (
    <>
      {STUMP_POSITIONS.map((position, index) => (
        <mesh
          key={`stump-${position[0]}-${position[2]}`}
          ref={setStumpRef(index)}
        >
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshStandardMaterial color={STUMP_COLOR} transparent />
        </mesh>
      ))}
    </>
  );
}

function CricketLabel({ opacityRef }: { opacityRef: OpacityRef }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useFrame(() => {
    const span = spanRef.current;
    if (!span) {
      return;
    }
    span.style.opacity = String(opacityRef.current.value);
  });

  return (
    <Html center position={[0, 1.6, 0]}>
      <span
        className="pointer-events-none select-none whitespace-nowrap font-display text-4xl text-text-primary-dark uppercase tracking-wide md:text-5xl"
        ref={spanRef}
      >
        Cricket
      </span>
    </Html>
  );
}

function CricketScene({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);
  const fillLightRef = useRef<DirectionalLight>(null);

  useEffect(() => {
    const fillLight = fillLightRef.current;
    if (!fillLight) {
      return;
    }
    fillLight.color.set(BLUE_LIGHT_COLOR);
    fillLight.intensity = 0.5;
    fillLight.position.set(-3, 1, 2);
  }, []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    group.visible = opacityRef.current.value > 0.001;
  });

  return (
    <group ref={groupRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color", "intensity", and "position" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <pointLight color={GOLD_LIGHT_COLOR} intensity={2} position={[3, 3, 3]} />
      <directionalLight ref={fillLightRef} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={0.3} />
      <CricketGround opacityRef={opacityRef} />
      <CricketStumps opacityRef={opacityRef} />
      <DustParticles opacityRef={opacityRef} />
      <CricketLabel opacityRef={opacityRef} />
    </group>
  );
}

function useReducedMotion(): boolean {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

const CROSSFADE_WIDTH = 0.15;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Each scene i owns raw-progress range [i, i+1]: fully opaque inside that
// range, ramping 0<->1 across a CROSSFADE_WIDTH window shared with its
// neighbor at each boundary. Scene 0 is exempt from the leading ramp so it
// starts fully visible at progress 0 instead of fading in.
function getSceneOpacity(progress: number, index: number): number {
  if (progress < index) {
    return index === 0 ? 1 : clamp01(1 - (index - progress) / CROSSFADE_WIDTH);
  }
  if (progress > index + 1) {
    return index === SCENE_COUNT - 1
      ? 1
      : clamp01(1 - (progress - (index + 1)) / CROSSFADE_WIDTH);
  }
  return 1;
}

function useSceneOrchestration(
  containerRef: RefObject<HTMLDivElement | null>,
  sceneOpacityRefs: OpacityRef[],
  onActiveSceneChange: (index: number) => void
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        end: `+=${reducedMotion ? 100 : PIN_LENGTH_PERCENT}%`,
        id: "sports-scroll-pin",
        onUpdate: (self) => {
          const progress = self.progress * SCENE_COUNT;
          const activeIndex = Math.min(SCENE_COUNT - 1, Math.floor(progress));

          for (const [index, opacityRef] of sceneOpacityRefs.entries()) {
            opacityRef.current.value = getSceneOpacity(progress, index);
          }

          onActiveSceneChange(activeIndex);
        },
        pin: !reducedMotion,
        scrub: true,
        start: "top top",
        trigger: container,
      });

      return () => trigger.kill();
    }, container);

    return () => ctx.revert();
  }, [containerRef, sceneOpacityRefs, onActiveSceneChange, reducedMotion]);
}

interface ProgressDotsProps {
  activeIndex: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

function ProgressDots({ activeIndex, containerRef }: ProgressDotsProps) {
  const handleDotClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const container = containerRef.current;
      const index = Number(event.currentTarget.dataset.sceneIndex);
      if (!(container && Number.isFinite(index))) {
        return;
      }

      const trigger = ScrollTrigger.getById("sports-scroll-pin");
      const containerTop =
        container.getBoundingClientRect().top + window.scrollY;
      const totalScroll = trigger
        ? trigger.end - trigger.start
        : window.innerHeight * SCENE_COUNT;
      const targetTop = containerTop + (index / SCENE_COUNT) * totalScroll;

      // Instant native scroll — Lenis (see SmoothScrollProvider) reads the
      // new position each frame and lerps toward it, so "smooth" here would
      // stack a second easing curve on top of Lenis's own.
      window.scrollTo({ top: targetTop });
    },
    [containerRef]
  );

  return (
    <nav
      aria-label="Sport scene navigation"
      className="fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-8"
    >
      {SCENE_LABELS.map((label, index) => (
        <button
          aria-current={activeIndex === index}
          aria-label={`Go to ${label} scene`}
          className={cn(
            "h-2.5 w-2.5 rounded-full border border-white/30 transition-all duration-200",
            activeIndex === index
              ? "scale-125 border-transparent bg-primary"
              : "bg-transparent hover:border-white/60"
          )}
          data-scene-index={index}
          key={label}
          onClick={handleDotClick}
          type="button"
        />
      ))}
    </nav>
  );
}

export function SportsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sceneOpacityRefs = useMemo<OpacityRef[]>(
    () =>
      Array.from({ length: SCENE_COUNT }, (_, index) => ({
        current: { value: index === 0 ? 1 : 0 },
      })),
    []
  );

  const handleActiveSceneChange = useCallback((index: number) => {
    setActiveIndex((current) => (current === index ? current : index));
  }, []);

  useSceneOrchestration(
    containerRef,
    sceneOpacityRefs,
    handleActiveSceneChange
  );

  return (
    <div
      className="relative h-screen overflow-hidden bg-bg-dark"
      data-theme="dark"
      ref={containerRef}
    >
      <SceneCanvas camera={{ fov: 50, position: CAMERA_POSITION }}>
        <CameraRig />
        <CricketScene opacityRef={sceneOpacityRefs[0]} />
      </SceneCanvas>
      <ProgressDots activeIndex={activeIndex} containerRef={containerRef} />
    </div>
  );
}
