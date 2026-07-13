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
  MeshBasicMaterial as MeshBasicMaterialType,
  MeshPhysicalMaterial as MeshPhysicalMaterialType,
  MeshStandardMaterial as MeshStandardMaterialType,
} from "three";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  DoubleSide,
  Line,
  LineBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { SceneCanvas } from "@/components/three/SceneCanvas.tsx";
import { cn } from "@/lib/utils.ts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  RectAreaLightUniformsLib.init();
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

// Per-scene camera keyframes, one per scene in SCENE_LABELS order.
const CAMERA_KEYFRAMES: {
  lookAt: [number, number, number];
  position: [number, number, number];
}[] = [
  { lookAt: [0, 0, 0], position: [0, -1, 4] },
  { lookAt: [0, 0, 0], position: [0, 3, 2] },
  { lookAt: [0, 1, 0], position: [0, 1.5, 6] },
  { lookAt: [0, 0, 0], position: [0, 2, 8] },
  { lookAt: [0, 1, 0], position: [0, 1.5, 3] },
  { lookAt: [0, 1, 0], position: [0, 0.5, 4] },
];
const CAMERA_TWEEN_DURATION = 0.8;

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

const POOL_WIDTH = 8;
const POOL_LENGTH = 14;
const POOL_COLOR = "#0288D1";
const LANE_COUNT = 5;
const LANE_COLOR = "#FFFFFF";
const LANE_POSITIONS_X = Array.from({ length: LANE_COUNT }, (_, index) => {
  const step = POOL_WIDTH / (LANE_COUNT + 1);
  return -POOL_WIDTH / 2 + step * (index + 1);
});

const CAUSTIC_GRID_COLS = 8;
const CAUSTIC_GRID_ROWS = 12;
const CAUSTIC_COUNT = CAUSTIC_GRID_COLS * CAUSTIC_GRID_ROWS;
const CAUSTIC_COLOR = "#FFFFFF";
const CAUSTIC_CELL_SIZE = 0.35;
const CAUSTIC_MAX_OPACITY = 0.25;

const RIPPLE_COUNT = 30;
const RIPPLE_COLOR = "#FFFFFF";
const RIPPLE_RADIUS = 0.3;
const RIPPLE_MAX_OPACITY = 0.35;

const COURT_WIDTH = 6.1;
const COURT_LENGTH = 13.4;
const COURT_COLOR = "#3D7A2E";
const COURT_LINE_COLOR = "#FFFFFF";
const NET_COLOR = "#FFFFFF";
const NET_HEIGHT = 0.75;
const AMBIENT_LIGHT_WHITE = "#F9FAFB";

interface CourtLineSpec {
  position: [number, number, number];
  size: [number, number, number];
}

const COURT_LINES: CourtLineSpec[] = [
  { position: [0, 0.01, -COURT_LENGTH / 2], size: [COURT_WIDTH, 0.01, 0.05] },
  { position: [0, 0.01, COURT_LENGTH / 2], size: [COURT_WIDTH, 0.01, 0.05] },
  {
    position: [-COURT_WIDTH / 2, 0.01, 0],
    size: [0.05, 0.01, COURT_LENGTH],
  },
  { position: [COURT_WIDTH / 2, 0.01, 0], size: [0.05, 0.01, COURT_LENGTH] },
  { position: [0, 0.01, -1.98], size: [COURT_WIDTH, 0.01, 0.05] },
  { position: [0, 0.01, 1.98], size: [COURT_WIDTH, 0.01, 0.05] },
  { position: [0, 0.01, 0], size: [COURT_WIDTH, 0.01, 0.02] },
];

const COURT_LIGHT_POSITIONS: [number, number, number][] = [
  [-1.5, 5, -3],
  [1.5, 5, -3],
  [-1.5, 5, 3],
  [1.5, 5, 3],
];

const SHUTTLE_CORK_COLOR = "#F5F0E8";
const SHUTTLE_FEATHER_COLOR = "#FFFFFF";
const SHUTTLE_FEATHER_COUNT = 8;
const SHUTTLE_ARC_POINTS: [number, number, number][] = [
  [0, 1.2, -5.5],
  [-1, 2.4, -2],
  [0, 2.8, 0],
  [1, 2.4, 2],
  [0, 1.2, 5.5],
];
const SHUTTLE_ARC_DURATION = 3;
const SHUTTLE_TRAIL_SEGMENTS = 60;

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

function CameraRig({ activeIndex }: { activeIndex: number }) {
  const { camera } = useThree();
  const initialLookAt = CAMERA_KEYFRAMES[0].lookAt;
  const lookAtRef = useRef({
    x: initialLookAt[0],
    y: initialLookAt[1],
    z: initialLookAt[2],
  });

  useEffect(() => {
    const keyframe = CAMERA_KEYFRAMES[activeIndex];
    if (!keyframe) {
      return;
    }

    const positionTween = gsap.to(camera.position, {
      duration: CAMERA_TWEEN_DURATION,
      ease: "power2.inOut",
      x: keyframe.position[0],
      y: keyframe.position[1],
      z: keyframe.position[2],
    });
    const lookAtTween = gsap.to(lookAtRef.current, {
      duration: CAMERA_TWEEN_DURATION,
      ease: "power2.inOut",
      x: keyframe.lookAt[0],
      y: keyframe.lookAt[1],
      z: keyframe.lookAt[2],
    });

    return () => {
      positionTween.kill();
      lookAtTween.kill();
    };
  }, [activeIndex, camera]);

  useFrame(() => {
    const target = lookAtRef.current;
    camera.lookAt(target.x, target.y, target.z);
  });

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

interface SceneLabelProps {
  label: string;
  opacityRef: OpacityRef;
  position: [number, number, number];
}

function SceneLabel({ label, opacityRef, position }: SceneLabelProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useFrame(() => {
    const span = spanRef.current;
    if (!span) {
      return;
    }
    span.style.opacity = String(opacityRef.current.value);
  });

  return (
    <Html center position={position}>
      <span
        className="pointer-events-none select-none whitespace-nowrap font-display text-4xl text-text-primary-dark uppercase tracking-wide md:text-5xl"
        ref={spanRef}
      >
        {label}
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
      <SceneLabel
        label="Cricket"
        opacityRef={opacityRef}
        position={[0, 1.6, 0]}
      />
    </group>
  );
}

const pulseDummy = new Object3D();

function PoolSurface({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    const material = meshRef.current?.material as
      | MeshPhysicalMaterialType
      | undefined;
    if (!material) {
      return;
    }
    material.metalness = 0;
    material.roughness = 0.1;
    material.transmission = 0.3;
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const opacity = opacityRef.current.value;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshPhysicalMaterialType;
    material.opacity = opacity;
  });

  return (
    // biome-ignore lint/suspicious/noUnknownAttribute: "rotation" is a valid react-three-fiber intrinsic prop, not a DOM attribute
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <planeGeometry args={[POOL_WIDTH, POOL_LENGTH]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshPhysicalMaterial color={POOL_COLOR} transparent />
    </mesh>
  );
}

function LaneLines({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const opacity = opacityRef.current.value;
    for (const mesh of meshRefs.current) {
      if (!mesh) {
        continue;
      }
      mesh.visible = opacity > 0.001;
      const material = mesh.material as MeshBasicMaterialType;
      material.opacity = opacity;
    }
  });

  const setLaneRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      meshRefs.current[index] = el;
      el?.position.set(LANE_POSITIONS_X[index], 0.01, 0);
    },
    []
  );

  return (
    <>
      {LANE_POSITIONS_X.map((x, index) => (
        <mesh key={`lane-${x}`} ref={setLaneRef(index)}>
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <boxGeometry args={[0.05, 0.01, POOL_LENGTH]} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshBasicMaterial color={LANE_COLOR} transparent />
        </mesh>
      ))}
    </>
  );
}

interface CausticCellData {
  phase: number;
  speed: number;
  x: number;
  z: number;
}

function buildCausticCells(): CausticCellData[] {
  const cells: CausticCellData[] = [];
  const colStep = POOL_WIDTH / CAUSTIC_GRID_COLS;
  const rowStep = POOL_LENGTH / CAUSTIC_GRID_ROWS;

  for (let row = 0; row < CAUSTIC_GRID_ROWS; row += 1) {
    for (let col = 0; col < CAUSTIC_GRID_COLS; col += 1) {
      cells.push({
        phase: (row + col) * 0.4,
        speed: 1.2 + Math.random() * 0.4,
        x: -POOL_WIDTH / 2 + colStep * (col + 0.5),
        z: -POOL_LENGTH / 2 + rowStep * (row + 0.5),
      });
    }
  }

  return cells;
}

function CausticGrid({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<InstancedMesh>(null);
  const cells = useMemo(() => buildCausticCells(), []);
  const planeArgs: [number, number] = [CAUSTIC_CELL_SIZE, CAUSTIC_CELL_SIZE];

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const time = clock.getElapsedTime();
    const opacity = opacityRef.current.value;

    for (const [index, cell] of cells.entries()) {
      const pulse = (Math.sin(time * cell.speed + cell.phase) + 1) / 2;
      pulseDummy.position.set(cell.x, 0.02, cell.z);
      pulseDummy.rotation.set(-Math.PI / 2, 0, 0);
      pulseDummy.scale.setScalar(0.4 + pulse * 0.8);
      pulseDummy.updateMatrix();
      mesh.setMatrixAt(index, pulseDummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshBasicMaterialType;
    material.opacity = opacity * CAUSTIC_MAX_OPACITY;
  });

  return (
    // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
    <instancedMesh args={[undefined, undefined, CAUSTIC_COUNT]} ref={meshRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <planeGeometry args={planeArgs} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshBasicMaterial color={CAUSTIC_COLOR} transparent />
    </instancedMesh>
  );
}

interface RippleData {
  phase: number;
  speed: number;
  x: number;
  z: number;
}

function buildRipples(): RippleData[] {
  const ripples: RippleData[] = [];

  for (let i = 0; i < RIPPLE_COUNT; i += 1) {
    ripples.push({
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.6,
      x: (Math.random() - 0.5) * POOL_WIDTH,
      z: (Math.random() - 0.5) * POOL_LENGTH,
    });
  }

  return ripples;
}

function RippleParticles({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<InstancedMesh>(null);
  const ripples = useMemo(() => buildRipples(), []);
  const geometry = useMemo(() => new CircleGeometry(RIPPLE_RADIUS, 16), []);

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

    for (const [index, ripple] of ripples.entries()) {
      const pulse = (Math.sin(time * ripple.speed + ripple.phase) + 1) / 2;
      pulseDummy.position.set(ripple.x, 0.03, ripple.z);
      pulseDummy.rotation.set(-Math.PI / 2, 0, 0);
      pulseDummy.scale.setScalar(0.2 + pulse * 0.8);
      pulseDummy.updateMatrix();
      mesh.setMatrixAt(index, pulseDummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshBasicMaterialType;
    material.opacity = opacity * RIPPLE_MAX_OPACITY;
  });

  return (
    <instancedMesh
      // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
      args={[geometry, undefined, RIPPLE_COUNT]}
      ref={meshRef}
    >
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshBasicMaterial color={RIPPLE_COLOR} transparent />
    </instancedMesh>
  );
}

function SwimmingScene({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);
  const pointLightRef = useRef<import("three").PointLight>(null);

  useEffect(() => {
    pointLightRef.current?.position.set(0, 5, 0);
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
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <ambientLight color={BLUE_LIGHT_COLOR} intensity={1.5} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <pointLight color="#FFFFFF" intensity={1} ref={pointLightRef} />
      <PoolSurface opacityRef={opacityRef} />
      <LaneLines opacityRef={opacityRef} />
      <CausticGrid opacityRef={opacityRef} />
      <RippleParticles opacityRef={opacityRef} />
      <SceneLabel
        label="Swimming"
        opacityRef={opacityRef}
        position={[0, 0.5, -6]}
      />
    </group>
  );
}

function CourtPlane({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

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
      <planeGeometry args={[COURT_WIDTH, COURT_LENGTH]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshStandardMaterial color={COURT_COLOR} transparent />
    </mesh>
  );
}

function CourtLines({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const opacity = opacityRef.current.value;
    for (const mesh of meshRefs.current) {
      if (!mesh) {
        continue;
      }
      mesh.visible = opacity > 0.001;
      const material = mesh.material as MeshBasicMaterialType;
      material.opacity = opacity;
    }
  });

  const setLineRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      meshRefs.current[index] = el;
      el?.position.set(...COURT_LINES[index].position);
    },
    []
  );

  return (
    <>
      {COURT_LINES.map((line, index) => (
        <mesh
          key={`court-line-${line.position.join("-")}`}
          ref={setLineRef(index)}
        >
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <boxGeometry args={line.size} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshBasicMaterial color={COURT_LINE_COLOR} transparent />
        </mesh>
      ))}
    </>
  );
}

function Net({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    meshRef.current?.position.set(0, NET_HEIGHT / 2, 0);
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const opacity = opacityRef.current.value;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshBasicMaterialType;
    material.opacity = opacity * 0.8;
  });

  return (
    <mesh ref={meshRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <boxGeometry args={[0.02, NET_HEIGHT, COURT_WIDTH]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshBasicMaterial color={NET_COLOR} transparent />
    </mesh>
  );
}

const lookTarget = new Vector3();

function Shuttlecock({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);
  const corkRef = useRef<Mesh>(null);
  const featherRefs = useRef<(Mesh | null)[]>([]);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        SHUTTLE_ARC_POINTS.map(([x, y, z]) => new Vector3(x, y, z))
      ),
    []
  );

  // JSX's lowercase `line` intrinsic collides with the DOM's SVGLineElement
  // type, so the trail is built imperatively and mounted via <primitive>.
  const trailLine = useMemo(() => {
    const points = curve.getSpacedPoints(SHUTTLE_TRAIL_SEGMENTS);
    const positions = new Float32Array(points.length * 3);
    for (const [index, point] of points.entries()) {
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 1);
    const material = new LineBasicMaterial({
      color: SHUTTLE_FEATHER_COLOR,
      transparent: true,
    });
    return new Line(geometry, material);
  }, [curve]);

  useEffect(
    () => () => {
      trailLine.geometry.dispose();
      (trailLine.material as LineBasicMaterial).dispose();
    },
    [trailLine]
  );

  const setFeatherRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      featherRefs.current[index] = el;
      if (!el) {
        return;
      }
      const angle = (index / SHUTTLE_FEATHER_COUNT) * Math.PI * 2;
      el.position.set(Math.cos(angle) * 0.05, 0.15, Math.sin(angle) * 0.05);
      el.rotation.set(-0.3, angle, 0);
    },
    []
  );

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const opacity = opacityRef.current.value;
    group.visible = opacity > 0.001;

    const t =
      (clock.getElapsedTime() % SHUTTLE_ARC_DURATION) / SHUTTLE_ARC_DURATION;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    group.position.copy(point);
    lookTarget.copy(point).add(tangent);
    group.lookAt(lookTarget);

    const revealed = Math.max(1, Math.floor(t * SHUTTLE_TRAIL_SEGMENTS));
    trailLine.geometry.setDrawRange(0, revealed);

    const cork = corkRef.current;
    if (cork) {
      const material = cork.material as MeshStandardMaterialType;
      material.opacity = opacity;
    }

    for (const feather of featherRefs.current) {
      if (!feather) {
        continue;
      }
      feather.visible = opacity > 0.001;
      const material = feather.material as MeshBasicMaterialType;
      material.opacity = opacity * 0.85;
      material.side = DoubleSide;
    }

    trailLine.visible = opacity > 0.001;
    (trailLine.material as LineBasicMaterial).opacity = opacity * 0.5;
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh ref={corkRef}>
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <cylinderGeometry args={[0.1, 0.15, 0.2]} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshStandardMaterial color={SHUTTLE_CORK_COLOR} transparent />
        </mesh>
        {Array.from({ length: SHUTTLE_FEATHER_COUNT }, (_, index) => {
          const angle = (index / SHUTTLE_FEATHER_COUNT) * Math.PI * 2;
          return (
            <mesh key={`feather-${angle}`} ref={setFeatherRef(index)}>
              {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
              <planeGeometry args={[0.05, 0.4]} />
              {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
              <meshBasicMaterial color={SHUTTLE_FEATHER_COLOR} transparent />
            </mesh>
          );
        })}
      </group>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "object" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <primitive object={trailLine} />
    </>
  );
}

function CourtLights() {
  const lightRefs = useRef<(import("three").SpotLight | null)[]>([]);
  const targetRefs = useRef<(Object3D | null)[]>([]);

  useEffect(() => {
    for (const [index, position] of COURT_LIGHT_POSITIONS.entries()) {
      const light = lightRefs.current[index];
      const target = targetRefs.current[index];
      if (!(light && target)) {
        continue;
      }
      light.position.set(...position);
      light.angle = Math.PI / 6;
      light.penumbra = 0.4;
      light.intensity = 1;
      target.position.set(position[0], 0, position[2]);
      light.target = target;
    }
  }, []);

  const setLightRef = useCallback(
    (index: number) => (el: import("three").SpotLight | null) => {
      lightRefs.current[index] = el;
    },
    []
  );
  const setTargetRef = useCallback(
    (index: number) => (el: Object3D | null) => {
      targetRefs.current[index] = el;
    },
    []
  );

  return (
    <>
      {COURT_LIGHT_POSITIONS.map((position, index) => (
        <group key={`court-light-${position[0]}-${position[2]}`}>
          <spotLight color="#FFFFFF" ref={setLightRef(index)} />
          <object3D ref={setTargetRef(index)} />
        </group>
      ))}
    </>
  );
}

function BadmintonScene({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    group.visible = opacityRef.current.value > 0.001;
  });

  return (
    <group ref={groupRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <ambientLight color={AMBIENT_LIGHT_WHITE} intensity={0.4} />
      <CourtLights />
      <CourtPlane opacityRef={opacityRef} />
      <CourtLines opacityRef={opacityRef} />
      <Net opacityRef={opacityRef} />
      <Shuttlecock opacityRef={opacityRef} />
      <SceneLabel
        label="Badminton"
        opacityRef={opacityRef}
        position={[0, 3, -6]}
      />
    </group>
  );
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const TENNIS_COURT_WIDTH = 10.97;
const TENNIS_COURT_LENGTH = 23.77;
const TENNIS_SINGLES_WIDTH = 8.23;
const TENNIS_SERVICE_LINE_Z = 6.4;
const TENNIS_CLAY_COLOR = "#C4622D";
const TENNIS_LINE_COLOR = "#FFFFFF";
const TENNIS_NET_COLOR = "#FFFFFF";
const TENNIS_NET_HEIGHT = 0.91;
const TENNIS_BALL_COLOR = "#CFE03B";
const TENNIS_BALL_RADIUS = 0.13;
const TENNIS_KEY_LIGHT_COLOR = "#FFF3E0";
const TENNIS_AMBIENT_COLOR = "#FFECB3";

const TENNIS_COURT_LINES: CourtLineSpec[] = [
  {
    position: [0, 0.01, TENNIS_COURT_LENGTH / 2],
    size: [TENNIS_COURT_WIDTH, 0.01, 0.05],
  },
  {
    position: [0, 0.01, -TENNIS_COURT_LENGTH / 2],
    size: [TENNIS_COURT_WIDTH, 0.01, 0.05],
  },
  {
    position: [-TENNIS_COURT_WIDTH / 2, 0.01, 0],
    size: [0.05, 0.01, TENNIS_COURT_LENGTH],
  },
  {
    position: [TENNIS_COURT_WIDTH / 2, 0.01, 0],
    size: [0.05, 0.01, TENNIS_COURT_LENGTH],
  },
  {
    position: [-TENNIS_SINGLES_WIDTH / 2, 0.01, 0],
    size: [0.05, 0.01, TENNIS_COURT_LENGTH],
  },
  {
    position: [TENNIS_SINGLES_WIDTH / 2, 0.01, 0],
    size: [0.05, 0.01, TENNIS_COURT_LENGTH],
  },
  {
    position: [0, 0.01, TENNIS_SERVICE_LINE_Z],
    size: [TENNIS_SINGLES_WIDTH, 0.01, 0.05],
  },
  {
    position: [0, 0.01, -TENNIS_SERVICE_LINE_Z],
    size: [TENNIS_SINGLES_WIDTH, 0.01, 0.05],
  },
  {
    position: [0, 0.01, 0],
    size: [0.05, 0.01, TENNIS_SERVICE_LINE_Z * 2],
  },
];

const TENNIS_BALL_PATH_POINTS: [number, number, number][] = [
  [0, 1.4, 9],
  [0, 0.9, 5],
  [0, 0.9, 1],
  [0, 0.4, -3],
  [0, 0.05, -7],
  [0, 1.1, -4],
  [0, 1.0, 0],
  [0, 1.3, 5],
];
const TENNIS_LOOP_DURATION = 4;
const TENNIS_BALL_MIN_Y = 0.05;
const TENNIS_BALL_MAX_Y = 1.4;
const TENNIS_BALL_SQUASHED_SCALE = 0.7;
const TENNIS_BALL_STRETCHED_SCALE = 1.2;
const TENNIS_TRAIL_LENGTH = 20;
const TENNIS_TRAIL_MAX_OPACITY = 0.5;

function TennisCourt({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

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
      <planeGeometry args={[TENNIS_COURT_WIDTH, TENNIS_COURT_LENGTH]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshStandardMaterial color={TENNIS_CLAY_COLOR} transparent />
    </mesh>
  );
}

function TennisCourtLines({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const opacity = opacityRef.current.value;
    for (const mesh of meshRefs.current) {
      if (!mesh) {
        continue;
      }
      mesh.visible = opacity > 0.001;
      const material = mesh.material as MeshBasicMaterialType;
      material.opacity = opacity;
    }
  });

  const setLineRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      meshRefs.current[index] = el;
      el?.position.set(...TENNIS_COURT_LINES[index].position);
    },
    []
  );

  return (
    <>
      {TENNIS_COURT_LINES.map((line, index) => (
        <mesh
          key={`tennis-line-${line.position.join("-")}`}
          ref={setLineRef(index)}
        >
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <boxGeometry args={line.size} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshBasicMaterial color={TENNIS_LINE_COLOR} transparent />
        </mesh>
      ))}
    </>
  );
}

function TennisNet({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    meshRef.current?.position.set(0, TENNIS_NET_HEIGHT / 2, 0);
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const opacity = opacityRef.current.value;
    mesh.visible = opacity > 0.001;
    const material = mesh.material as MeshBasicMaterialType;
    material.opacity = opacity * 0.8;
  });

  return (
    <mesh ref={meshRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <boxGeometry args={[0.02, TENNIS_NET_HEIGHT, TENNIS_COURT_WIDTH]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshBasicMaterial color={TENNIS_NET_COLOR} transparent />
    </mesh>
  );
}

function TennisBall({ opacityRef }: { opacityRef: OpacityRef }) {
  const ballRef = useRef<Mesh>(null);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        TENNIS_BALL_PATH_POINTS.map(([x, y, z]) => new Vector3(x, y, z)),
        true
      ),
    []
  );

  const trailPositions = useMemo(
    () =>
      Array.from(
        { length: TENNIS_TRAIL_LENGTH },
        () => new Vector3(...TENNIS_BALL_PATH_POINTS[0])
      ),
    []
  );

  // Individual 2-point segments (rather than one polyline) so each can fade
  // to a different opacity, giving the trail a tail that dims with age.
  const trailSegments = useMemo(
    () =>
      Array.from({ length: TENNIS_TRAIL_LENGTH - 1 }, () => {
        const geometry = new BufferGeometry();
        geometry.setAttribute(
          "position",
          new BufferAttribute(new Float32Array(6), 3)
        );
        const material = new LineBasicMaterial({
          color: TENNIS_BALL_COLOR,
          transparent: true,
        });
        return new Line(geometry, material);
      }),
    []
  );

  useEffect(
    () => () => {
      for (const segment of trailSegments) {
        segment.geometry.dispose();
        (segment.material as LineBasicMaterial).dispose();
      }
    },
    [trailSegments]
  );

  useFrame(({ clock }) => {
    const mesh = ballRef.current;
    if (!mesh) {
      return;
    }

    const opacity = opacityRef.current.value;
    mesh.visible = opacity > 0.001;

    const t =
      (clock.getElapsedTime() % TENNIS_LOOP_DURATION) / TENNIS_LOOP_DURATION;
    const point = curve.getPointAt(t);
    mesh.position.copy(point);

    const heightT = clampValue(
      (point.y - TENNIS_BALL_MIN_Y) / (TENNIS_BALL_MAX_Y - TENNIS_BALL_MIN_Y),
      0,
      1
    );
    mesh.scale.y =
      TENNIS_BALL_SQUASHED_SCALE +
      heightT * (TENNIS_BALL_STRETCHED_SCALE - TENNIS_BALL_SQUASHED_SCALE);

    for (let i = trailPositions.length - 1; i > 0; i -= 1) {
      trailPositions[i].copy(trailPositions[i - 1]);
    }
    trailPositions[0].copy(point);

    for (const [index, segment] of trailSegments.entries()) {
      const from = trailPositions[index];
      const to = trailPositions[index + 1];
      const positionAttr = segment.geometry.attributes
        .position as BufferAttribute;
      positionAttr.setXYZ(0, from.x, from.y, from.z);
      positionAttr.setXYZ(1, to.x, to.y, to.z);
      positionAttr.needsUpdate = true;

      segment.visible = opacity > 0.001;
      const material = segment.material as LineBasicMaterial;
      material.opacity =
        opacity *
        TENNIS_TRAIL_MAX_OPACITY *
        (1 - index / (trailSegments.length - 1));
    }

    const material = mesh.material as MeshStandardMaterialType;
    material.opacity = opacity;
  });

  return (
    <>
      <mesh ref={ballRef}>
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
        <sphereGeometry args={[TENNIS_BALL_RADIUS, 16, 16]} />
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
        <meshStandardMaterial color={TENNIS_BALL_COLOR} transparent />
      </mesh>
      {trailSegments.map((segment) => (
        <primitive
          key={segment.uuid}
          // biome-ignore lint/suspicious/noUnknownAttribute: "object" is a valid react-three-fiber intrinsic prop, not a DOM attribute
          object={segment}
        />
      ))}
    </>
  );
}

function TennisScene({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    group.visible = opacityRef.current.value > 0.001;
  });

  return (
    <group ref={groupRef}>
      <directionalLight
        color={TENNIS_KEY_LIGHT_COLOR}
        // biome-ignore lint/suspicious/noUnknownAttribute: "intensity" is a valid react-three-fiber intrinsic prop, not a DOM attribute
        intensity={1.5}
        // biome-ignore lint/suspicious/noUnknownAttribute: "position" is a valid react-three-fiber intrinsic prop, not a DOM attribute
        position={[5, 10, 5]}
      />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <ambientLight color={TENNIS_AMBIENT_COLOR} intensity={0.5} />
      <TennisCourt opacityRef={opacityRef} />
      <TennisCourtLines opacityRef={opacityRef} />
      <TennisNet opacityRef={opacityRef} />
      <TennisBall opacityRef={opacityRef} />
      <SceneLabel
        label="Tennis"
        opacityRef={opacityRef}
        position={[0, 3, -10]}
      />
    </group>
  );
}

const SQUASH_WIDTH = 6.4;
const SQUASH_LENGTH = 9.75;
const SQUASH_HEIGHT = 5.64;
const SQUASH_WALL_COLOR = "#E8E8E0";
const SQUASH_FLOOR_COLOR = "#C8C8C0";
const SQUASH_LINE_COLOR = "#FFFFFF";
const SQUASH_TIN_HEIGHT = 0.48;
const SQUASH_SERVICE_LINE_HEIGHT = 1.78;
const SQUASH_BALL_COLOR = "#18181B";
const SQUASH_BALL_RADIUS = 0.08;
const SQUASH_BALL_SPEED = 2.2;
const SQUASH_BALL_MARGIN = SQUASH_BALL_RADIUS + 0.05;
const SQUASH_BURST_COUNT = 6;
const SQUASH_BURST_PARTICLE_RADIUS = 0.025;
const SQUASH_BURST_DURATION = 0.3;
const SQUASH_BURST_MAX_RADIUS = 0.35;
const SQUASH_BURST_MAX_OPACITY = 0.9;
const SQUASH_BURST_COLOR = "#FFFFFF";
const SQUASH_FILL_COLOR = "#D6E8FF";
const SQUASH_LIGHT_COLOR = "#FFFFFF";

interface SquashWallSpec {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}

const SQUASH_WALLS: SquashWallSpec[] = [
  {
    position: [0, SQUASH_HEIGHT / 2, -SQUASH_LENGTH / 2],
    rotation: [0, 0, 0],
    size: [SQUASH_WIDTH, SQUASH_HEIGHT],
  },
  {
    position: [0, SQUASH_HEIGHT / 2, SQUASH_LENGTH / 2],
    rotation: [0, Math.PI, 0],
    size: [SQUASH_WIDTH, SQUASH_HEIGHT],
  },
  {
    position: [-SQUASH_WIDTH / 2, SQUASH_HEIGHT / 2, 0],
    rotation: [0, Math.PI / 2, 0],
    size: [SQUASH_LENGTH, SQUASH_HEIGHT],
  },
  {
    position: [SQUASH_WIDTH / 2, SQUASH_HEIGHT / 2, 0],
    rotation: [0, -Math.PI / 2, 0],
    size: [SQUASH_LENGTH, SQUASH_HEIGHT],
  },
];

const SQUASH_COURT_LINES: CourtLineSpec[] = [
  {
    position: [0, SQUASH_TIN_HEIGHT, -SQUASH_LENGTH / 2 + 0.02],
    size: [SQUASH_WIDTH, 0.05, 0.02],
  },
  {
    position: [0, SQUASH_SERVICE_LINE_HEIGHT, -SQUASH_LENGTH / 2 + 0.02],
    size: [SQUASH_WIDTH, 0.05, 0.02],
  },
];

function SquashWalls({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useEffect(() => {
    for (const mesh of meshRefs.current) {
      const material = mesh?.material as MeshStandardMaterialType | undefined;
      if (material) {
        material.side = DoubleSide;
      }
    }
  }, []);

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

  const setWallRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      meshRefs.current[index] = el;
    },
    []
  );

  return (
    <>
      {SQUASH_WALLS.map((wall, index) => (
        <mesh
          key={`squash-wall-${wall.position.join("-")}`}
          // biome-ignore lint/suspicious/noUnknownAttribute: "position" is a valid react-three-fiber intrinsic prop, not a DOM attribute
          position={wall.position}
          ref={setWallRef(index)}
          // biome-ignore lint/suspicious/noUnknownAttribute: "rotation" is a valid react-three-fiber intrinsic prop, not a DOM attribute
          rotation={wall.rotation}
        >
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <planeGeometry args={wall.size} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshStandardMaterial color={SQUASH_WALL_COLOR} transparent />
        </mesh>
      ))}
    </>
  );
}

function SquashFloor({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

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
      <planeGeometry args={[SQUASH_WIDTH, SQUASH_LENGTH]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshStandardMaterial color={SQUASH_FLOOR_COLOR} transparent />
    </mesh>
  );
}

function SquashCourtLines({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const opacity = opacityRef.current.value;
    for (const mesh of meshRefs.current) {
      if (!mesh) {
        continue;
      }
      mesh.visible = opacity > 0.001;
      const material = mesh.material as MeshBasicMaterialType;
      material.opacity = opacity;
    }
  });

  const setLineRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      meshRefs.current[index] = el;
      el?.position.set(...SQUASH_COURT_LINES[index].position);
    },
    []
  );

  return (
    <>
      {SQUASH_COURT_LINES.map((line, index) => (
        <mesh
          key={`squash-line-${line.position.join("-")}`}
          ref={setLineRef(index)}
        >
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <boxGeometry args={line.size} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshBasicMaterial color={SQUASH_LINE_COLOR} transparent />
        </mesh>
      ))}
    </>
  );
}

interface SquashBurstState {
  active: boolean;
  directions: Vector3[];
  origin: Vector3;
  startTime: number;
}

interface SquashBounds {
  xBound: number;
  yMax: number;
  yMin: number;
  zBound: number;
}

// Straight-line travel with axis-flip reflections at the court bounds — a
// lightweight stand-in for wall physics, not a physics engine.
function reflectWithinBounds(
  pos: Vector3,
  vel: Vector3,
  bounds: SquashBounds
): boolean {
  let bounced = false;
  if (pos.x > bounds.xBound || pos.x < -bounds.xBound) {
    pos.x = clampValue(pos.x, -bounds.xBound, bounds.xBound);
    vel.x *= -1;
    bounced = true;
  }
  if (pos.y > bounds.yMax || pos.y < bounds.yMin) {
    pos.y = clampValue(pos.y, bounds.yMin, bounds.yMax);
    vel.y *= -1;
    bounced = true;
  }
  if (pos.z > bounds.zBound || pos.z < -bounds.zBound) {
    pos.z = clampValue(pos.z, -bounds.zBound, bounds.zBound);
    vel.z *= -1;
    bounced = true;
  }
  return bounced;
}

function triggerSquashBurst(
  state: SquashBurstState,
  origin: Vector3,
  startTime: number
): void {
  state.active = true;
  state.startTime = startTime;
  state.origin.copy(origin);
  for (const dir of state.directions) {
    dir
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
  }
}

function updateSquashBurst(
  burstMesh: InstancedMesh,
  state: SquashBurstState,
  elapsed: number,
  opacity: number
): void {
  if (!state.active) {
    burstMesh.visible = false;
    return;
  }

  const t = (elapsed - state.startTime) / SQUASH_BURST_DURATION;
  if (t >= 1) {
    state.active = false;
    burstMesh.visible = false;
    return;
  }

  burstMesh.visible = opacity > 0.001;
  const radius = t * SQUASH_BURST_MAX_RADIUS;
  for (const [index, dir] of state.directions.entries()) {
    dummy.position.copy(state.origin).addScaledVector(dir, radius);
    dummy.updateMatrix();
    burstMesh.setMatrixAt(index, dummy.matrix);
  }
  burstMesh.instanceMatrix.needsUpdate = true;
  const burstMaterial = burstMesh.material as MeshBasicMaterialType;
  burstMaterial.opacity = (1 - t) * opacity * SQUASH_BURST_MAX_OPACITY;
}

function SquashBall({ opacityRef }: { opacityRef: OpacityRef }) {
  const ballRef = useRef<Mesh>(null);
  const burstMeshRef = useRef<InstancedMesh>(null);

  const position = useRef(new Vector3(0, SQUASH_HEIGHT / 2, 0));
  const velocity = useRef(
    new Vector3(
      Math.random() - 0.5,
      Math.random() * 0.4 + 0.1,
      Math.random() - 0.5
    )
      .normalize()
      .multiplyScalar(SQUASH_BALL_SPEED)
  );
  const burst = useRef<SquashBurstState>({
    active: false,
    directions: Array.from({ length: SQUASH_BURST_COUNT }, () => new Vector3()),
    origin: new Vector3(),
    startTime: 0,
  });

  const xBound = SQUASH_WIDTH / 2 - SQUASH_BALL_MARGIN;
  const zBound = SQUASH_LENGTH / 2 - SQUASH_BALL_MARGIN;
  const yMin = SQUASH_BALL_MARGIN;
  const yMax = SQUASH_HEIGHT - SQUASH_BALL_MARGIN;

  useFrame(({ clock }, delta) => {
    const mesh = ballRef.current;
    if (!mesh) {
      return;
    }

    const opacity = opacityRef.current.value;
    mesh.visible = opacity > 0.001;

    const pos = position.current;
    const vel = velocity.current;
    pos.addScaledVector(vel, delta);
    const bounced = reflectWithinBounds(pos, vel, {
      xBound,
      yMax,
      yMin,
      zBound,
    });

    mesh.position.copy(pos);
    const material = mesh.material as MeshStandardMaterialType;
    material.opacity = opacity;

    const elapsed = clock.getElapsedTime();
    const state = burst.current;
    if (bounced) {
      triggerSquashBurst(state, pos, elapsed);
    }

    const burstMesh = burstMeshRef.current;
    if (burstMesh) {
      updateSquashBurst(burstMesh, state, elapsed, opacity);
    }
  });

  return (
    <>
      <mesh ref={ballRef}>
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
        <sphereGeometry args={[SQUASH_BALL_RADIUS, 16, 16]} />
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
        <meshStandardMaterial color={SQUASH_BALL_COLOR} transparent />
      </mesh>
      <instancedMesh
        // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
        args={[undefined, undefined, SQUASH_BURST_COUNT]}
        ref={burstMeshRef}
      >
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
        <sphereGeometry args={[SQUASH_BURST_PARTICLE_RADIUS, 8, 8]} />
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
        <meshBasicMaterial color={SQUASH_BURST_COLOR} transparent />
      </instancedMesh>
    </>
  );
}

const SQUASH_LIGHT_POSITIONS: [number, number, number][] = [
  [-1.5, SQUASH_HEIGHT - 0.3, 0],
  [1.5, SQUASH_HEIGHT - 0.3, 0],
];

function SquashLights() {
  const lightRefs = useRef<(import("three").SpotLight | null)[]>([]);

  useEffect(() => {
    for (const [index, position] of SQUASH_LIGHT_POSITIONS.entries()) {
      const light = lightRefs.current[index];
      if (!light) {
        continue;
      }
      light.position.set(...position);
      light.angle = Math.PI / 4;
      light.penumbra = 0.3;
      light.intensity = 1.4;
    }
  }, []);

  const setLightRef = useCallback(
    (index: number) => (el: import("three").SpotLight | null) => {
      lightRefs.current[index] = el;
    },
    []
  );

  return (
    <>
      {SQUASH_LIGHT_POSITIONS.map((position, index) => (
        <spotLight
          color={SQUASH_LIGHT_COLOR}
          key={`squash-light-${position[0]}`}
          ref={setLightRef(index)}
        />
      ))}
    </>
  );
}

function SquashScene({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    group.visible = opacityRef.current.value > 0.001;
  });

  return (
    <group ref={groupRef}>
      <SquashLights />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <ambientLight color={SQUASH_FILL_COLOR} intensity={0.4} />
      <SquashWalls opacityRef={opacityRef} />
      <SquashFloor opacityRef={opacityRef} />
      <SquashCourtLines opacityRef={opacityRef} />
      <SquashBall opacityRef={opacityRef} />
      <SceneLabel
        label="Squash"
        opacityRef={opacityRef}
        position={[0, 4.5, -3]}
      />
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

const GYM_SPOT_COLOR = "#E53935";
const GYM_AMBIENT_COLOR = "#0A0E1A";
const GYM_RECT_LIGHT_COLOR = "#1E88E5";
const GYM_FLOOR_COLOR = "#111111";
const GYM_METAL_COLOR = "#2A2A2A";
const GYM_METAL_METALNESS = 0.8;
const GYM_METAL_ROUGHNESS = 0.3;

const GYM_WEIGHT_X_POSITIONS: number[] = [-2, 0, 2];
const GYM_BAR_LENGTH = 1.4;
const GYM_BAR_RADIUS = 0.04;
const GYM_PLATE_RADIUS = 0.3;
const GYM_PLATE_TUBE = 0.09;
const GYM_PLATE_OFFSET = 0.6;

const GYM_LIFT_MAX = 0.6;
const GYM_LIFT_HALF_DURATION = 1.25;
const GYM_LIFT_EASE = "power1.inOut";

const GYM_PARTICLE_COUNT = 150;
const GYM_PARTICLE_COLOR = "#E53935";
const GYM_PARTICLE_MAX_OPACITY = 0.2;
const GYM_PARTICLE_RADIUS = 0.025;
const GYM_PARTICLE_RISE_HEIGHT = 2;
const GYM_PARTICLE_SPREAD = 0.9;
const GYM_PARTICLE_BURST_DURATION = 1;
const GYM_PARTICLE_PEAK_THRESHOLD = 0.05;
const GYM_PARTICLE_RESET_THRESHOLD = 0.1;

function useGymLift(reducedMotion: boolean): OpacityRef {
  const liftRef = useRef({ value: 0 });

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const tween = gsap.to(liftRef.current, {
      duration: GYM_LIFT_HALF_DURATION,
      ease: GYM_LIFT_EASE,
      repeat: -1,
      value: GYM_LIFT_MAX,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  return liftRef;
}

function GymFloor({ opacityRef }: { opacityRef: OpacityRef }) {
  const meshRef = useRef<Mesh>(null);

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
      <planeGeometry args={[8, 6]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshStandardMaterial color={GYM_FLOOR_COLOR} transparent />
    </mesh>
  );
}

interface WeightSetProps {
  liftRef: OpacityRef;
  opacityRef: OpacityRef;
  xPosition: number;
}

function WeightSet({ liftRef, opacityRef, xPosition }: WeightSetProps) {
  const groupRef = useRef<Group>(null);
  const barRef = useRef<Mesh>(null);
  const plateRefs = useRef<(Mesh | null)[]>([]);

  useEffect(() => {
    const barMaterial = barRef.current?.material as
      | MeshStandardMaterialType
      | undefined;
    if (barMaterial) {
      barMaterial.metalness = GYM_METAL_METALNESS;
      barMaterial.roughness = GYM_METAL_ROUGHNESS;
    }
    for (const plate of plateRefs.current) {
      const plateMaterial = plate?.material as
        | MeshStandardMaterialType
        | undefined;
      if (plateMaterial) {
        plateMaterial.metalness = GYM_METAL_METALNESS;
        plateMaterial.roughness = GYM_METAL_ROUGHNESS;
      }
    }
  }, []);

  useEffect(() => {
    groupRef.current?.position.set(xPosition, 0, 0);
  }, [xPosition]);

  const setPlateRef = useCallback(
    (index: number) => (el: Mesh | null) => {
      plateRefs.current[index] = el;
      el?.position.set(
        0,
        0,
        index === 0 ? -GYM_PLATE_OFFSET : GYM_PLATE_OFFSET
      );
    },
    []
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const opacity = opacityRef.current.value;
    group.visible = opacity > 0.001;
    group.position.y = liftRef.current.value;

    const barMaterial = barRef.current?.material as
      | MeshStandardMaterialType
      | undefined;
    if (barMaterial) {
      barMaterial.opacity = opacity;
    }
    for (const plate of plateRefs.current) {
      const plateMaterial = plate?.material as
        | MeshStandardMaterialType
        | undefined;
      if (plateMaterial) {
        plateMaterial.opacity = opacity;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "rotation" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <mesh ref={barRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
          args={[GYM_BAR_RADIUS, GYM_BAR_RADIUS, GYM_BAR_LENGTH, 12]}
        />
        {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
        <meshStandardMaterial color={GYM_METAL_COLOR} transparent />
      </mesh>
      {[0, 1].map((index) => (
        <mesh key={`plate-${xPosition}-${index}`} ref={setPlateRef(index)}>
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
          <torusGeometry args={[GYM_PLATE_RADIUS, GYM_PLATE_TUBE, 8, 20]} />
          {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
          <meshStandardMaterial color={GYM_METAL_COLOR} transparent />
        </mesh>
      ))}
    </group>
  );
}

interface GymParticleData {
  angle: number;
  radialOffset: number;
  riseSpeed: number;
}

function buildGymParticles(): GymParticleData[] {
  const particles: GymParticleData[] = [];

  for (let i = 0; i < GYM_PARTICLE_COUNT; i += 1) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radialOffset: Math.random() * GYM_PARTICLE_SPREAD,
      riseSpeed: 0.6 + Math.random() * 0.8,
    });
  }

  return particles;
}

function EnergyParticles({
  liftRef,
  opacityRef,
}: {
  liftRef: OpacityRef;
  opacityRef: OpacityRef;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const particles = useMemo(() => buildGymParticles(), []);
  const geometry = useMemo(
    () => new SphereGeometry(GYM_PARTICLE_RADIUS, 6, 6),
    []
  );
  const burstActiveRef = useRef(false);
  const burstStartRef = useRef(0);
  const triggeredRef = useRef(false);

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

    const opacity = opacityRef.current.value;
    const lift = liftRef.current.value;
    const elapsed = clock.getElapsedTime();

    if (
      lift > GYM_LIFT_MAX - GYM_PARTICLE_PEAK_THRESHOLD &&
      !triggeredRef.current
    ) {
      triggeredRef.current = true;
      burstActiveRef.current = true;
      burstStartRef.current = elapsed;
    } else if (lift < GYM_PARTICLE_RESET_THRESHOLD) {
      triggeredRef.current = false;
    }

    if (!burstActiveRef.current) {
      mesh.visible = false;
      return;
    }

    const t = (elapsed - burstStartRef.current) / GYM_PARTICLE_BURST_DURATION;
    if (t >= 1) {
      burstActiveRef.current = false;
      mesh.visible = false;
      return;
    }

    mesh.visible = opacity > 0.001;

    // Emit from the lifted bar height (GYM_LIFT_MAX), not the floor — the
    // burst triggers at the top of the lift cycle.
    for (const [index, particle] of particles.entries()) {
      const radius = particle.radialOffset * (0.4 + t * 0.6);
      const y =
        GYM_LIFT_MAX + t * GYM_PARTICLE_RISE_HEIGHT * particle.riseSpeed;
      dummy.position.set(
        Math.cos(particle.angle) * radius,
        y,
        Math.sin(particle.angle) * radius
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    const material = mesh.material as MeshBasicMaterialType;
    material.opacity = (1 - t) * opacity * GYM_PARTICLE_MAX_OPACITY;
  });

  return (
    <instancedMesh
      // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
      args={[geometry, undefined, GYM_PARTICLE_COUNT]}
      ref={meshRef}
    >
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshBasicMaterial color={GYM_PARTICLE_COLOR} transparent />
    </instancedMesh>
  );
}

function GymScene({ opacityRef }: { opacityRef: OpacityRef }) {
  const groupRef = useRef<Group>(null);
  const spotLightRef = useRef<import("three").SpotLight>(null);
  const spotTargetRef = useRef<Object3D>(null);
  const rectLightRef = useRef<import("three").RectAreaLight>(null);
  const reducedMotion = useReducedMotion();
  const liftRef = useGymLift(reducedMotion);

  useEffect(() => {
    const light = spotLightRef.current;
    const target = spotTargetRef.current;
    if (!(light && target)) {
      return;
    }
    light.position.set(0, 6, 0);
    light.angle = 0.4;
    light.intensity = 3;
    target.position.set(0, 0, 0);
    light.target = target;
  }, []);

  useEffect(() => {
    const rectLight = rectLightRef.current;
    if (!rectLight) {
      return;
    }
    rectLight.position.set(-4, 2, 0);
    rectLight.lookAt(0, 1, 0);
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
      <spotLight color={GYM_SPOT_COLOR} ref={spotLightRef} />
      <object3D ref={spotTargetRef} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "color" and "intensity" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <ambientLight color={GYM_AMBIENT_COLOR} intensity={0.1} />
      <rectAreaLight
        color={GYM_RECT_LIGHT_COLOR}
        height={4}
        // biome-ignore lint/suspicious/noUnknownAttribute: "intensity" is a valid react-three-fiber intrinsic prop, not a DOM attribute
        intensity={4}
        ref={rectLightRef}
        width={2}
      />
      <GymFloor opacityRef={opacityRef} />
      {GYM_WEIGHT_X_POSITIONS.map((xPosition) => (
        <WeightSet
          key={`weight-set-${xPosition}`}
          liftRef={liftRef}
          opacityRef={opacityRef}
          xPosition={xPosition}
        />
      ))}
      <EnergyParticles liftRef={liftRef} opacityRef={opacityRef} />
      <SceneLabel label="Gym" opacityRef={opacityRef} position={[0, 3, -1]} />
    </group>
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
        <CameraRig activeIndex={activeIndex} />
        <CricketScene opacityRef={sceneOpacityRefs[0]} />
        <SwimmingScene opacityRef={sceneOpacityRefs[1]} />
        <BadmintonScene opacityRef={sceneOpacityRefs[2]} />
        <TennisScene opacityRef={sceneOpacityRefs[3]} />
        <SquashScene opacityRef={sceneOpacityRefs[4]} />
        <GymScene opacityRef={sceneOpacityRefs[5]} />
      </SceneCanvas>
      <ProgressDots activeIndex={activeIndex} containerRef={containerRef} />
    </div>
  );
}
