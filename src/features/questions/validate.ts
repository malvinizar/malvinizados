import { CATEGORIES } from "@/config/categories";
import { DIFICULTADES, MEDIA_TIPOS, type BancoPreguntas, type Pregunta } from "./types";

const CATEGORIA_IDS = CATEGORIES.map((c) => c.id) as readonly string[];

/**
 * Valida el banco de preguntas y devuelve la lista de errores encontrados.
 * Sin dependencias externas para poder usarse en el navegador y en scripts.
 */
export function validarBanco(data: unknown): string[] {
  const errores: string[] = [];
  if (!data || typeof data !== "object" || !Array.isArray((data as BancoPreguntas).preguntas)) {
    return ["El archivo debe tener la forma { version, preguntas: [...] }."];
  }

  const ids = new Set<number>();
  (data as BancoPreguntas).preguntas.forEach((p: Partial<Pregunta>, i) => {
    const tag = `Pregunta #${p?.id ?? `(posición ${i})`}`;
    if (typeof p.id !== "number") errores.push(`${tag}: falta "id" numérico.`);
    else if (ids.has(p.id)) errores.push(`${tag}: "id" repetido.`);
    else ids.add(p.id);

    if (!p.categoria || !CATEGORIA_IDS.includes(p.categoria)) {
      errores.push(`${tag}: categoría inválida (${String(p.categoria)}).`);
    }
    if (p.tipo !== "multiple") errores.push(`${tag}: "tipo" debe ser "multiple".`);
    if (!p.pregunta?.trim()) errores.push(`${tag}: falta el texto de la pregunta.`);
    if (!Array.isArray(p.opciones) || p.opciones.length !== 4 || p.opciones.some((o) => !String(o).trim())) {
      errores.push(`${tag}: debe tener 4 opciones no vacías.`);
    } else if (new Set(p.opciones).size !== 4) {
      errores.push(`${tag}: hay opciones repetidas.`);
    }
    if (typeof p.correcta !== "number" || p.correcta < 0 || p.correcta > 3 || !Number.isInteger(p.correcta)) {
      errores.push(`${tag}: "correcta" debe ser un número entre 0 y 3.`);
    }
    if (!p.explicacion?.trim()) errores.push(`${tag}: falta la explicación.`);
    if (!p.dificultad || !DIFICULTADES.includes(p.dificultad)) {
      errores.push(`${tag}: dificultad inválida (${String(p.dificultad)}).`);
    }
    if (!p.fuente?.trim()) errores.push(`${tag}: falta la fuente.`);
    if (!p.media || !MEDIA_TIPOS.includes(p.media.tipo) || typeof p.media.url !== "string") {
      errores.push(`${tag}: "media" inválido.`);
    }
  });

  return errores;
}
