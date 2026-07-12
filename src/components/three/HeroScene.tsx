"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  type InstancedMesh,
  LinearFilter,
  type Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Vector3,
} from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARTICLE_COUNT = 2000;
const GOLD_RATIO = 0.2;
const DISPERSE_RADIUS = 10;
const CONVERGE_DURATION = 2;
const CURSOR_INFLUENCE = 0.6;
const SCROLL_FADE_END = 0.3;
const PRIMARY_COLOR = "#1E88E5";
const GOLD_COLOR = "#FFB300";
const HALO_RADIUS_MIN = 3.5;
const HALO_RADIUS_MAX = 6;
const LOGO_SRC = "/GSC.svg";
const LOGO_WORLD_WIDTH = 4;
const LOGO_START_SCALE = 0.85;

const dummy = new Object3D();
const tmpVec = new Vector3();

interface ParticleData {
  color: Color;
  haloTarget: Vector3;
  scatterTarget: Vector3;
  start: Vector3;
  swirlOffset: number;
  swirlRadius: number;
  swirlSpeed: number;
}

function buildParticles(reducedMotion: boolean): ParticleData[] {
  const particles: ParticleData[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const isGold = Math.random() < GOLD_RATIO;
    const color = new Color(isGold ? GOLD_COLOR : PRIMARY_COLOR);

    const haloTarget = new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    )
      .normalize()
      .multiplyScalar(
        HALO_RADIUS_MIN + Math.random() * (HALO_RADIUS_MAX - HALO_RADIUS_MIN)
      );

    const dispersedStart = new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    )
      .normalize()
      .multiplyScalar(Math.random() * DISPERSE_RADIUS);

    const start = reducedMotion ? haloTarget.clone() : dispersedStart;

    const scatterTarget = haloTarget
      .clone()
      .normalize()
      .multiplyScalar(DISPERSE_RADIUS * 1.5);

    particles.push({
      color,
      haloTarget,
      scatterTarget,
      start,
      swirlOffset: Math.random() * Math.PI * 2,
      swirlRadius: 0.15 + Math.random() * 0.35,
      swirlSpeed: 0.2 + Math.random() * 0.3,
    });
  }

  return particles;
}

function useReducedMotion(): boolean {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

function ParticleField({
  reducedMotion,
  scrollProgressRef,
}: {
  reducedMotion: boolean;
  scrollProgressRef: RefObject<number>;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const convergenceRef = useRef({ value: 0 });
  const { size } = useThree();

  const particles = useMemo(
    () => buildParticles(reducedMotion),
    [reducedMotion]
  );

  const geometry = useMemo(() => new SphereGeometry(0.035, 8, 8), []);
  const material = useMemo(
    () => new MeshBasicMaterial({ transparent: true }),
    []
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    for (const [index, particle] of particles.entries()) {
      mesh.setColorAt(index, particle.color);
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [particles]);

  useEffect(() => {
    if (reducedMotion) {
      convergenceRef.current.value = 1;
      return;
    }

    const tween = gsap.to(convergenceRef.current, {
      duration: CONVERGE_DURATION,
      ease: "power2.out",
      value: 1,
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      cursorRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursorRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    const currentGeometry = geometry;
    const currentMaterial = material;
    return () => {
      currentGeometry.dispose();
      currentMaterial.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const time = clock.getElapsedTime();
    const convergence = convergenceRef.current.value;
    const scatter = scrollProgressRef.current;
    const aspect = size.width / size.height;

    for (const [index, particle] of particles.entries()) {
      tmpVec.copy(particle.start).lerp(particle.haloTarget, convergence);

      const swirlAngle = time * particle.swirlSpeed + particle.swirlOffset;
      tmpVec.x += Math.cos(swirlAngle) * particle.swirlRadius;
      tmpVec.y += Math.sin(swirlAngle) * particle.swirlRadius;

      if (convergence > 0.001) {
        tmpVec.x += cursorRef.current.x * CURSOR_INFLUENCE * aspect * 0.3;
        tmpVec.y += cursorRef.current.y * CURSOR_INFLUENCE * 0.3;
      }

      if (scatter > 0) {
        tmpVec.lerp(particle.scatterTarget, scatter);
      }

      dummy.position.copy(tmpVec);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = scatter < 1;
    material.opacity = 1 - scatter;
  });

  return (
    // biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute
    <instancedMesh args={[geometry, material, PARTICLE_COUNT]} ref={meshRef} />
  );
}

function LogoPlane({
  reducedMotion,
  scrollProgressRef,
}: {
  reducedMotion: boolean;
  scrollProgressRef: RefObject<number>;
}) {
  const meshRef = useRef<Mesh>(null);
  const revealRef = useRef({ value: reducedMotion ? 1 : 0 });
  const [texture, setTexture] = useState<Texture | null>(null);
  const [aspect, setAspect] = useState(1);

  useEffect(() => {
    const loader = new TextureLoader();
    let cancelled = false;

    loader.load(LOGO_SRC, (loaded) => {
      if (cancelled) {
        return;
      }
      loaded.colorSpace = SRGBColorSpace;
      loaded.generateMipmaps = false;
      loaded.minFilter = LinearFilter;
      loaded.magFilter = LinearFilter;
      const image = loaded.image as { width: number; height: number };
      setAspect(image.width / image.height || 1);
      setTexture(loaded);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!texture) {
      return;
    }
    return () => texture.dispose();
  }, [texture]);

  useEffect(() => {
    if (!texture || reducedMotion) {
      return;
    }

    const tween = gsap.to(revealRef.current, {
      duration: CONVERGE_DURATION,
      ease: "power2.out",
      value: 1,
    });

    return () => {
      tween.kill();
    };
  }, [texture, reducedMotion]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!(mesh && texture)) {
      return;
    }

    const reveal = revealRef.current.value;
    const scatter = scrollProgressRef.current;
    const scale = LOGO_START_SCALE + (1 - LOGO_START_SCALE) * reveal;

    mesh.scale.setScalar(scale);
    mesh.visible = scatter < 1;
    const material = mesh.material as MeshBasicMaterial;
    material.opacity = reveal * (1 - scatter);
  });

  if (!texture) {
    return null;
  }

  const planeWidth = LOGO_WORLD_WIDTH;
  const planeHeight = planeWidth / aspect;

  return (
    <mesh ref={meshRef}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "args" is a valid react-three-fiber intrinsic prop, not a DOM attribute */}
      <planeGeometry args={[planeWidth, planeHeight]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: "map" and "transparent" are valid react-three-fiber intrinsic props, not DOM attributes */}
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

export function HeroScene() {
  const reducedMotion = useReducedMotion();
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      end: `${SCROLL_FADE_END * 100}% top`,
      onUpdate: (self) => {
        scrollProgressRef.current = Math.min(
          self.progress / SCROLL_FADE_END,
          1
        );
      },
      scrub: true,
      start: "top top",
      trigger: document.body,
    });

    return () => trigger.kill();
  }, []);

  return (
    <>
      <ParticleField
        reducedMotion={reducedMotion}
        scrollProgressRef={scrollProgressRef}
      />
      <LogoPlane
        reducedMotion={reducedMotion}
        scrollProgressRef={scrollProgressRef}
      />
    </>
  );
}
