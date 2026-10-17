import { CATEGORY_BY_ID, type CategoriaId, type CategoryDef } from "@/config/categories";

export type WheelSector =
  | { kind: "categoria"; category: CategoryDef }
  | { kind: "comodin" };

/**
 * Orden de los sectores, en sentido horario empezando arriba.
 * Cada categoría aparece dos veces, más un comodín (Sol de Mayo) que deja elegir la categoría.
 */
const ORDER: Array<CategoriaId | "comodin"> = [
  "Historia",
  "Música",
  "Cine",
  "Fútbol",
  "comodin",
  "Historia",
  "Música",
  "Cine",
  "Fútbol",
];

export const SECTORS: readonly WheelSector[] = ORDER.map((id) =>
  id === "comodin" ? { kind: "comodin" } : { kind: "categoria", category: CATEGORY_BY_ID[id] },
);

export const SECTOR_ANGLE = 360 / SECTORS.length;

/** Ángulo (en grados, horario desde arriba) del centro de un sector. */
export function sectorCenter(index: number): number {
  return index * SECTOR_ANGLE + SECTOR_ANGLE / 2;
}

/** Índice del sector que queda bajo la aguja para una rotación dada de la ruleta. */
export function sectorAtPointer(rotation: number): number {
  const angle = (((-rotation % 360) + 360) % 360);
  return Math.floor(angle / SECTOR_ANGLE) % SECTORS.length;
}

/**
 * Calcula la rotación final para que la ruleta frene en `targetIndex`.
 * Suma varias vueltas completas y un desvío aleatorio dentro del sector
 * (lejos de los bordes) para que cada giro se vea distinto.
 */
export function computeTargetRotation(
  current: number,
  targetIndex: number,
  turns: number,
  random: () => number = Math.random,
): number {
  const jitter = (random() - 0.5) * SECTOR_ANGLE * 0.6;
  const targetAngle = sectorCenter(targetIndex) + jitter;
  // La aguja está arriba: necesitamos que (-rotation mod 360) == targetAngle.
  const desired = (((-targetAngle - current) % 360) + 360) % 360;
  return current + turns * 360 + desired;
}
