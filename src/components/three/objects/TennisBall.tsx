"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { AmbientLight, DirectionalLight, Group, Mesh } from "three";
import { MeshStandardMaterial, SphereGeometry, TubeGeometry } from "three";
import { createSeamCurve } from "@/components/three/objects/seamCurve.ts";
import { useHeroObjectFade } from "@/components/three/objects/useHeroObjectFade.ts";

const BALL_RADIUS = 1;
const SEAM_RADIUS = BALL_RADIUS * 1.005;
const SEAM_TUBE_RADIUS = 0.015;
const FELT_COLOR = "#CFE03B";
const SEAM_COLOR = "#FFFFFF";
const KEY_LIGHT_COLOR = "#FFFFFF";
const FILL_LIGHT_COLOR = "#1E88E5";
const FILL_LIGHT_INTENSITY = 0.25;
const KEY_LIGHT_INTENSITY = 1;
const Y_ROTATION_SPEED = 0.0035;
const BOUNCE_SPEED = 0.9;
const BOUNCE_AMPLITUDE = 0.12;
const BOUNCE_SHARPNESS = 0.6;

function useReducedMotion(): boolean {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

export function TennisBall() {
  const groupRef = useRef<Group>(null);
  const ballRef = useRef<Mesh>(null);
  const seamRef = useRef<Mesh>(null);
  const fillLightRef = useRef<AmbientLight>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const reducedMotion = useReducedMotion();
  const opacityRef = useHeroObjectFade();

  const ballGeometry = useMemo(
    () => new SphereGeometry(BALL_RADIUS, 32, 32),
    []
  );
  const ballMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: FELT_COLOR,
        roughness: 0.8,
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

    const fillLight = fillLightRef.current;
    if (fillLight) {
      fillLight.color.set(FILL_LIGHT_COLOR);
      fillLight.intensity = FILL_LIGHT_INTENSITY;
    }
    const keyLight = keyLightRef.current;
    if (keyLight) {
      keyLight.color.set(KEY_LIGHT_COLOR);
      keyLight.intensity = KEY_LIGHT_INTENSITY;
      keyLight.position.set(2, 3, 2);
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
      const phase = clock.elapsedTime * BOUNCE_SPEED;
      const bounce = -(Math.abs(Math.sin(phase)) ** BOUNCE_SHARPNESS);
      group.position.y = bounce * BOUNCE_AMPLITUDE;
    }

    const opacity = opacityRef.current;
    ballMaterial.opacity = opacity;
    seamMaterial.opacity = opacity;
  });

  return (
    <group ref={groupRef}>
      <ambientLight ref={fillLightRef} />
      <directionalLight ref={keyLightRef} />
      <mesh ref={ballRef} />
      <mesh ref={seamRef} />
    </group>
  );
}
