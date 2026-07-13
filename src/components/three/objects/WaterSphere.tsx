"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { AmbientLight, DirectionalLight, Group, Mesh } from "three";
import { MeshPhysicalMaterial, SphereGeometry } from "three";
import { useHeroObjectFade } from "@/components/three/objects/useHeroObjectFade.ts";

const SPHERE_RADIUS = 1;
const SPHERE_SEGMENTS = 64;
const WATER_AMBIENT_COLOR = "#1E88E5";
const KEY_LIGHT_COLOR = "#FFFFFF";
const AMBIENT_INTENSITY = 0.5;
const KEY_LIGHT_INTENSITY = 1.2;
const WATER_IOR = 1.33;
const Y_ROTATION_SPEED = 0.002;
const WAVE_FREQUENCY = 2.5;
const WAVE_SPEED = 0.6;
const WAVE_AMPLITUDE = 0.02;

function useReducedMotion(): boolean {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

export function WaterSphere() {
  const groupRef = useRef<Group>(null);
  const sphereRef = useRef<Mesh>(null);
  const ambientRef = useRef<AmbientLight>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const reducedMotion = useReducedMotion();
  const opacityRef = useHeroObjectFade();

  const geometry = useMemo(
    () => new SphereGeometry(SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS),
    []
  );
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        ior: WATER_IOR,
        metalness: 0,
        roughness: 0,
        transmission: 0.9,
        transparent: true,
      }),
    []
  );
  const basePositions = useMemo(() => {
    const attribute = geometry.attributes.position;
    return Float32Array.from(attribute.array as Float32Array);
  }, [geometry]);

  useEffect(() => {
    const sphere = sphereRef.current;
    if (sphere) {
      sphere.geometry = geometry;
      sphere.material = material;
    }

    const ambient = ambientRef.current;
    if (ambient) {
      ambient.color.set(WATER_AMBIENT_COLOR);
      ambient.intensity = AMBIENT_INTENSITY;
    }
    const keyLight = keyLightRef.current;
    if (keyLight) {
      keyLight.color.set(KEY_LIGHT_COLOR);
      keyLight.intensity = KEY_LIGHT_INTENSITY;
      keyLight.position.set(2, 3, 2);
    }

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (group && !reducedMotion) {
      group.rotation.y += Y_ROTATION_SPEED;
    }

    if (!reducedMotion) {
      const positionAttribute = geometry.attributes.position;
      const array = positionAttribute.array as Float32Array;
      const t = clock.elapsedTime * WAVE_SPEED;

      for (let i = 0; i < array.length; i += 3) {
        const baseX = basePositions[i];
        const baseY = basePositions[i + 1];
        const baseZ = basePositions[i + 2];
        const wave =
          Math.sin(baseX * WAVE_FREQUENCY + t) *
          Math.cos(baseZ * WAVE_FREQUENCY + t) *
          WAVE_AMPLITUDE;
        const scale = 1 + wave;
        array[i] = baseX * scale;
        array[i + 1] = baseY * scale;
        array[i + 2] = baseZ * scale;
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    material.opacity = opacityRef.current;
  });

  return (
    <group ref={groupRef}>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={keyLightRef} />
      <mesh ref={sphereRef} />
    </group>
  );
}
