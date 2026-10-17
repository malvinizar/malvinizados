import { CATEGORIES, type CategoriaId } from "@/config/categories";
import { nivelPara, type NivelMalvinometro } from "@/config/scoring";
import type { AnswerRecord } from "./gameMachine";

export interface CategoriaStats {
  categoria: CategoriaId;
  respondidas: number;
  aciertos: number;
  porcentaje: number;
}

export interface GameStats {
  puntaje: number;
  aciertos: number;
  errores: number;
  /** Racha actual de correctas seguidas. */
  racha: number;
  mejorRacha: number;
  /** Malvinómetro: 0 a 100. Sube con cada respuesta correcta. */
  malvinometro: number;
  nivel: NivelMalvinometro;
  nivelIndice: number;
  porCategoria: CategoriaStats[];
  fuerte: CategoriaStats | null;
  debil: CategoriaStats | null;
}

export function calcularStats(historial: readonly AnswerRecord[], total: number): GameStats {
  const aciertos = historial.filter((h) => h.correcta).length;
  const puntaje = historial.reduce((sum, h) => sum + h.puntos, 0);
  const racha = historial.length ? historial[historial.length - 1].racha : 0;
  const mejorRacha = historial.reduce((max, h) => Math.max(max, h.racha), 0);
  const malvinometro = total > 0 ? Math.round((aciertos / total) * 100) : 0;
  const { nivel, indice } = nivelPara(malvinometro);

  const porCategoria: CategoriaStats[] = CATEGORIES.map((c) => {
    const items = historial.filter((h) => h.categoria === c.id);
    const ok = items.filter((h) => h.correcta).length;
    return {
      categoria: c.id,
      respondidas: items.length,
      aciertos: ok,
      porcentaje: items.length ? ok / items.length : 0,
    };
  }).filter((c) => c.respondidas > 0);

  // Más fuerte: mayor % de aciertos (desempata la que tuvo más preguntas).
  // Más débil: menor %, y solo si es distinta de la más fuerte.
  const ordenadas = [...porCategoria].sort(
    (a, b) => b.porcentaje - a.porcentaje || b.respondidas - a.respondidas,
  );
  const fuerte = ordenadas[0] ?? null;
  const candidataDebil = [...porCategoria].sort(
    (a, b) => a.porcentaje - b.porcentaje || b.respondidas - a.respondidas,
  )[0];
  const debil =
    candidataDebil && fuerte && candidataDebil.categoria !== fuerte.categoria && candidataDebil.porcentaje < fuerte.porcentaje
      ? candidataDebil
      : null;

  return {
    puntaje,
    aciertos,
    errores: historial.length - aciertos,
    racha,
    mejorRacha,
    malvinometro,
    nivel,
    nivelIndice: indice,
    porCategoria,
    fuerte,
    debil,
  };
}
