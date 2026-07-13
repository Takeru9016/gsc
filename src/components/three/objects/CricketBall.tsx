"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { AmbientLight, Group, Mesh, PointLight } from "three";
import { MeshStandardMaterial, SphereGeometry, TubeGeometry } from "three";
import { createSeamCurve } from "@/components/three/objects/seamCurve.ts";
import { useHeroObjectFade } from "@/components/three/objects/useHeroObjectFade.ts";

const BALL_RADIUS = 1;
const SEAM_RADIUS = BALL_RADIUS * 1.005;
const SEAM_TUBE_RADIUS = 0.015;
const LEATHER_COLOR = "#8B1010";
const SEAM_COLOR = "#FFFFFF";
const WARM_LIGHT_COLOR = "#FFB300";
const COOL_LIGHT_COLOR = "#1E88E5";
const WARM_LIGHT_INTENSITY = 1.4;
const COOL_LIGHT_INTENSITY = 0.5;
const AMBIENT_INTENSITY = 0.15;
const Y_ROTATION_SPEED = 0.003;
const WOBBLE_SPEED = 0.6;
const WOBBLE_AMPLITUDE = 0.05;

function useReducedMotion(): boolean {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

export function CricketBall() {
  const groupRef = useRef<Group>(null);
  const ballRef = useRef<Mesh>(null);
  const seamRef = useRef<Mesh>(null);
  const warmLightRef = useRef<PointLight>(null);
  const coolLightRef = useRef<PointLight>(null);
  const ambientRef = useRef<AmbientLight>(null);
  const reducedMotion = useReducedMotion();
  const opacityRef = useHeroObjectFade();

  const ballGeometry = useMemo(
    () => new SphereGeometry(BALL_RADIUS, 32, 32),
    []
  );
  const ballMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: LEATHER_COLOR,
        roughness: 0.45,
        transparent: true,
      }),
    []
  );
  const seamCurve = useMemo(() => createSeamCurve(SEAM_RADIUS), []);
  const seamGeometry = useMemo(
    () => new TubeGeometry(seamCurve, 128, SEAM_TUBE_RADIUS, 8, true),
    [seamCurve]
  );
  const seamMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: SEAM_COLOR,
        roughness: 0.6,
        transparent: true,
      }),
    []
  );

  useEffect(() => {
    const ball = ballRef.current;
    if (ball) {
      ball.geometry = ballGeometry;
      ball.material = ballMaterial;
    }
    const seam = seamRef.current;
    if (seam) {
      seam.geometry = seamGeometry;
      seam.material = seamMaterial;
    }

    const warmLight = warmLightRef.current;
    if (warmLight) {
      warmLight.color.set(WARM_LIGHT_COLOR);
      warmLight.intensity = WARM_LIGHT_INTENSITY;
      warmLight.position.set(2, 2, 2);
    }
    const coolLight = coolLightRef.current;
    if (coolLight) {
      coolLight.color.set(COOL_LIGHT_COLOR);
      coolLight.intensity = COOL_LIGHT_INTENSITY;
      coolLight.position.set(-2, -1, -2);
    }
    const ambient = ambientRef.current;
    if (ambient) {
      ambient.intensity = AMBIENT_INTENSITY;
    }

    return () => {
      ballGeometry.dispose();
      ballMaterial.dispose();
      seamGeometry.dispose();
      seamMaterial.dispose();
    };
  }, [ballGeometry, ballMaterial, seamGeometry, seamMaterial]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (group && !reducedMotion) {
      group.rotation.y += Y_ROTATION_SPEED;
      group.rotation.x =
        Math.sin(clock.elapsedTime * WOBBLE_SPEED) * WOBBLE_AMPLITUDE;
    }

    const opacity = opacityRef.current;
    ballMaterial.opacity = opacity;
    seamMaterial.opacity = opacity;
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={warmLightRef} />
      <pointLight ref={coolLightRef} />
      <ambientLight ref={ambientRef} />
      <mesh ref={ballRef} />
      <mesh ref={seamRef} />
    </group>
  );
}
