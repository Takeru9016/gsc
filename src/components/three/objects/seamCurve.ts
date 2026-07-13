import { CatmullRomCurve3, Vector3 } from "three";

const SEAM_POINT_COUNT = 64;
const SEAM_POLAR_SWING = Math.PI / 3;

function buildSeamPoints(radius: number): Vector3[] {
  const points: Vector3[] = [];

  for (let i = 0; i <= SEAM_POINT_COUNT; i += 1) {
    const t = (i / SEAM_POINT_COUNT) * Math.PI * 2;
    const phi = t;
    const theta = Math.PI / 2 + Math.sin(t * 2) * SEAM_POLAR_SWING;

    points.push(
      new Vector3(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.cos(theta),
        radius * Math.sin(theta) * Math.sin(phi)
      )
    );
  }

  return points;
}

export function createSeamCurve(radius: number): CatmullRomCurve3 {
  return new CatmullRomCurve3(buildSeamPoints(radius), true, "catmullrom", 0.5);
}
