import type { CategoriaId } from "@/config/categories";
import raw from "@/data/preguntas.json";
import type { BancoPreguntas, Pregunta } from "./types";
import { validarBanco } from "./validate";

const banco = raw as unknown as BancoPreguntas;

if (process.env.NODE_ENV !== "production") {
  const errores = validarBanco(banco);
  if (errores.length > 0) {
    console.warn(`[preguntas.json] ${errores.length} problema(s):\n- ${errores.join("\n- ")}`);
  }
}

/** Todas las preguntas del banco. */
export const PREGUNTAS: readonly Pregunta[] = banco.preguntas;

/** Preguntas de una categoría. */
export function preguntasDe(categoria: CategoriaId): Pregunta[] {
  return PREGUNTAS.filter((p) => p.categoria === categoria);
}

/** ¿El recurso multimedia de la pregunta está pendiente de cargar? */
export function mediaPendiente(p: Pregunta): boolean {
  return p.media.tipo !== "none" && p.media.url.trim() === "";
}
