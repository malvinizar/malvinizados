import type { CategoriaId } from "@/config/categories";

export type Dificultad = "Fácil" | "Media" | "Difícil" | "Experto";
export type MediaTipo = "none" | "youtube" | "image" | "audio" | "iframe";

export interface PreguntaMedia {
  tipo: MediaTipo;
  /** Vacía mientras el recurso esté pendiente. */
  url: string;
}

/** Estructura de cada pregunta, tal como está en src/data/preguntas.json. */
export interface Pregunta {
  id: number;
  categoria: CategoriaId;
  tipo: "multiple";
  pregunta: string;
  opciones: [string, string, string, string];
  /** Índice (0 a 3) de la opción correcta dentro de `opciones`. */
  correcta: number;
  explicacion: string;
  dificultad: Dificultad;
  fuente: string;
  media: PreguntaMedia;
  /** Nota opcional para marcar algo a revisar. */
  todo?: string;
}

export interface BancoPreguntas {
  version: number;
  estado?: string;
  preguntas: Pregunta[];
}

export const DIFICULTADES: readonly Dificultad[] = ["Fácil", "Media", "Difícil", "Experto"];
export const MEDIA_TIPOS: readonly MediaTipo[] = ["none", "youtube", "image", "audio", "iframe"];
