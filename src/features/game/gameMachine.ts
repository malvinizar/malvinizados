import type { CategoriaId } from "@/config/categories";
import type { Pregunta } from "@/features/questions/types";

/**
 * Fases de la partida:
 * idle → spinning → reveal (categoría) | comodin (elegir) → question → answered → idle … → finished
 */
export type GamePhase = "idle" | "spinning" | "reveal" | "comodin" | "question" | "answered" | "finished";

export interface AnswerRecord {
  id: number;
  categoria: CategoriaId;
  dificultad: Pregunta["dificultad"];
  correcta: boolean;
}

export interface CurrentQuestion {
  pregunta: Pregunta;
  /** Orden en que se muestran las opciones (índices de `pregunta.opciones`). */
  orden: number[];
}

export interface GameState {
  phase: GamePhase;
  total: number;
  /** Sector donde frenó la ruleta. */
  sector: number | null;
  categoria: CategoriaId | null;
  current: CurrentQuestion | null;
  /** Índice (en el orden mostrado) de la opción elegida. */
  elegida: number | null;
  usadas: number[];
  historial: AnswerRecord[];
  inicio: number;
  fin: number | null;
}

export type GameAction =
  | { type: "SPIN"; sector: number }
  | { type: "SPIN_END"; categoria: CategoriaId | null }
  | { type: "PICK_CATEGORY"; categoria: CategoriaId }
  | { type: "SHOW_QUESTION"; current: CurrentQuestion }
  | { type: "ANSWER"; index: number }
  | { type: "NEXT" }
  | { type: "RESTART"; total: number; now: number };

export function initialGameState(total: number, now: number): GameState {
  return {
    phase: "idle",
    total,
    sector: null,
    categoria: null,
    current: null,
    elegida: null,
    usadas: [],
    historial: [],
    inicio: now,
    fin: null,
  };
}

/** Índice (en el orden mostrado) de la opción correcta. */
export function correctDisplayIndex(current: CurrentQuestion): number {
  return current.orden.indexOf(current.pregunta.correcta);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SPIN":
      if (state.phase !== "idle") return state;
      return { ...state, phase: "spinning", sector: action.sector, categoria: null };

    case "SPIN_END":
      if (state.phase !== "spinning") return state;
      // categoria null = comodín: el jugador elige.
      return action.categoria
        ? { ...state, phase: "reveal", categoria: action.categoria }
        : { ...state, phase: "comodin" };

    case "PICK_CATEGORY":
      if (state.phase !== "comodin") return state;
      return { ...state, phase: "reveal", categoria: action.categoria };

    case "SHOW_QUESTION":
      if (state.phase !== "reveal") return state;
      return {
        ...state,
        phase: "question",
        current: action.current,
        elegida: null,
        usadas: [...state.usadas, action.current.pregunta.id],
      };

    case "ANSWER": {
      if (state.phase !== "question" || !state.current) return state;
      const ok = action.index === correctDisplayIndex(state.current);
      const p = state.current.pregunta;
      return {
        ...state,
        phase: "answered",
        elegida: action.index,
        historial: [...state.historial, { id: p.id, categoria: p.categoria, dificultad: p.dificultad, correcta: ok }],
      };
    }

    case "NEXT": {
      if (state.phase !== "answered") return state;
      const terminado = state.historial.length >= state.total;
      return {
        ...state,
        phase: terminado ? "finished" : "idle",
        current: terminado ? state.current : null,
        elegida: terminado ? state.elegida : null,
        sector: null,
        fin: terminado ? Date.now() : null,
      };
    }

    case "RESTART":
      return initialGameState(action.total, action.now);

    default:
      return state;
  }
}
