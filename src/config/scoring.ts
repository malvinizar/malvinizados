import type { Dificultad } from "@/features/questions/types";

/** Puntos base por dificultad. */
export const PUNTOS: Record<Dificultad, number> = {
  Fácil: 100,
  Media: 200,
  Difícil: 300,
  Experto: 500,
};

/**
 * Multiplicador por racha de respuestas correctas seguidas
 * (contando la respuesta actual).
 */
export function multiplicadorRacha(racha: number): number {
  if (racha >= 5) return 2;
  if (racha >= 3) return 1.5;
  return 1;
}

export interface NivelMalvinometro {
  nombre: string;
  /** Porcentaje mínimo del Malvinómetro para alcanzar el nivel. */
  desde: number;
}

/** Niveles del Malvinómetro, de menor a mayor. Editá los nombres acá. */
export const NIVELES: readonly NivelMalvinometro[] = [
  { nombre: "Aprendiz", desde: 0 },
  { nombre: "Conocedor", desde: 20 },
  { nombre: "Memorioso", desde: 40 },
  { nombre: "Guardián de la Memoria", desde: 60 },
  { nombre: "Malvinizador", desde: 80 },
];

export function nivelPara(porcentaje: number): { nivel: NivelMalvinometro; indice: number } {
  let indice = 0;
  NIVELES.forEach((n, i) => {
    if (porcentaje >= n.desde) indice = i;
  });
  return { nivel: NIVELES[indice], indice };
}
