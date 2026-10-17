import { CATEGORIES, type CategoriaId } from "@/config/categories";
import { PREGUNTAS } from "@/features/questions/bank";
import type { Pregunta } from "@/features/questions/types";
import { SECTORS } from "@/features/wheel/sectors";
import type { CurrentQuestion } from "./gameMachine";

function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Preguntas de una categoría que todavía no salieron en la partida. */
export function remaining(categoria: CategoriaId, usadas: readonly number[]): Pregunta[] {
  return PREGUNTAS.filter((p) => p.categoria === categoria && !usadas.includes(p.id));
}

/** Categorías que todavía tienen preguntas sin usar. */
export function availableCategories(usadas: readonly number[]): CategoriaId[] {
  return CATEGORIES.map((c) => c.id).filter((id) => remaining(id, usadas).length > 0);
}

/**
 * Elige al azar el sector donde va a frenar la ruleta, entre los que tienen preguntas.
 * El comodín solo cuenta si queda alguna categoría disponible.
 */
export function pickSector(usadas: readonly number[]): number {
  const disponibles = availableCategories(usadas);
  const candidatos = SECTORS.map((s, i) => ({ s, i }))
    .filter(({ s }) => (s.kind === "comodin" ? disponibles.length > 0 : disponibles.includes(s.category.id)))
    .map(({ i }) => i);
  return candidatos[Math.floor(Math.random() * candidatos.length)] ?? 0;
}

/** Elige una pregunta sin repetir y mezcla el orden de las opciones. */
export function pickQuestion(categoria: CategoriaId, usadas: readonly number[]): CurrentQuestion | null {
  const pool = remaining(categoria, usadas);
  if (pool.length === 0) return null;
  const pregunta = pool[Math.floor(Math.random() * pool.length)];
  return { pregunta, orden: shuffle([0, 1, 2, 3]) };
}
