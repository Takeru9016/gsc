"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { AmbientLight, DirectionalLight, Group, Mesh } from "three";
import {
  CylinderGeometry,
  DoubleSide,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import { useHeroObjectFade } from "@/components/three/objects/useHeroObjectFade.ts";

const CORK_TOP_RADIUS = 0.15;
const CORK_BOTTOM_RADIUS = 0.2;
const CORK_HEIGHT = 0.25;
const CORK_RADIAL_SEGMENTS = 16;
const CORK_COLOR = "#F5F0E8";
const FEATHER_COUNT = 16;
const FEATHER_WIDTH = 0.1;
const FEATHER_LENGTH = 0.5;
const FEATHER_COLOR = "#FAFAFA";
const FEATHER_BASE_OPACITY = 0.85;
const FEATHER_FAN_RADIUS = 0.08;
const FEATHER_ANCHOR_Y = CORK_HEIGHT / 2 - 0.02;
const FEATHER_TILT = -0.4;
const GROUP_SCALE = 2.2;
const FLOAT_AMPLITUDE = 0.1;
const FLOAT_DURATION = 2;
const Y_SPIN_SPEED = 0.005;
const KEY_LIGHT_COLOR = "#FFFFFF";
const AMBIENT_INTENSITY = 0.6;
const KEY_LIGHT_INTENSITY = 0.8;

function useReducedMotion(): boolean {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

export function Shuttlecock() {
  const floatRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const corkRef = useRef<Mesh>(null);
  const featherRefs = useRef<(Mesh | null)[]>([]);
  const ambientRef = useRef<AmbientLight>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const reducedMotion = useReducedMotion();
  const opacityRef = useHeroObjectFade();

  const corkGeometry = useMemo(
    () =>
      new CylinderGeometry(
        CORK_TOP_RADIUS,
        CORK_BOTTOM_RADIUS,
        CORK_HEIGHT,
        CORK_RADIAL_SEGMENTS
      ),
    []
  );
  const corkMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: CORK_COLOR,
        roughness: 0.7,
        transparent: true,
      }),
    []
  );
  const featherGeometry = useMemo(
    () => new PlaneGeometry(FEATHER_WIDTH, FEATHER_LENGTH),
    []
  );
  const featherMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: FEATHER_COLOR,
        opacity: FEATHER_BASE_OPACITY,
        side: DoubleSide,
        transparent: true,
      }),
    []
  );

  const setFeatherRef = useCallback(
    (index: number) => (mesh: Mesh | null) => {
      featherRefs.current[index] = mesh;
    },
    []
  );

  useEffect(() => {
    const spin = spinRef.current;
    if (spin) {
      spin.scale.setScalar(GROUP_SCALE);
    }

    const cork = corkRef.current;
    if (cork) {
      cork.geometry = corkGeometry;
      cork.material = corkMaterial;
    }

    for (const [index, feather] of featherRefs.current.entries()) {
      if (!feather) {
        continue;
      }
      feather.geometry = featherGeometry;
      feather.material = featherMaterial;
      const angle = (index / FEATHER_COUNT) * Math.PI * 2;
      feather.position.set(
        Math.cos(angle) * FEATHER_FAN_RADIUS,
        FEATHER_ANCHOR_Y,
        Math.sin(angle) * FEATHER_FAN_RADIUS
      );
      feather.rotation.set(FEATHER_TILT, -angle, 0);
    }

    const ambient = ambientRef.current;
    if (ambient) {
      ambient.color.set(KEY_LIGHT_COLOR);
      ambient.intensity = AMBIENT_INTENSITY;
    }
    const keyLight = keyLightRef.current;
    if (keyLight) {
      keyLight.color.set(KEY_LIGHT_COLOR);
      keyLight.intensity = KEY_LIGHT_INTENSITY;
      keyLight.position.set(1.5, 2, 2);
    }

    return () => {
      corkGeometry.dispose();
      corkMaterial.dispose();
      featherGeometry.dispose();
      featherMaterial.dispose();
    };
  }, [corkGeometry, corkMaterial, featherGeometry, featherMaterial]);

  useFrame(({ clock }) => {
    const floatGroup = floatRef.current;
    if (floatGroup && !reducedMotion) {
      floatGroup.position.y =
        Math.sin((clock.elapsedTime / FLOAT_DURATION) * Math.PI * 2) *
        FLOAT_AMPLITUDE;
    }

    const spinGroup = spinRef.current;
    if (spinGroup && !reducedMotion) {
      spinGroup.rotation.y += Y_SPIN_SPEED;
    }

    const opacity = opacityRef.current;
    corkMaterial.opacity = opacity;
    featherMaterial.opacity = opacity * FEATHER_BASE_OPACITY;
  });

  return (
    <group ref={floatRef}>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={keyLightRef} />
      <group ref={spinRef}>
        <mesh ref={corkRef} />
        {Array.from({ length: FEATHER_COUNT }, (_, index) => {
          const angle = (index / FEATHER_COUNT) * Math.PI * 2;
          return <mesh key={`feather-${angle}`} ref={setFeatherRef(index)} />;
        })}
      </group>
    </group>
  );
}
