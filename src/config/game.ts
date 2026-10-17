/** Configuración general de la partida. */
export const GAME_CONFIG = {
  /** Cantidad de preguntas por partida. */
  preguntasPorPartida: 10,
  /** Duración del giro de la ruleta, en segundos. */
  duracionGiro: 4.8,
  /** Vueltas completas mínimas y máximas antes de frenar. */
  vueltasMin: 5,
  vueltasMax: 7,
  /** Cuánto dura la celebración de la categoría antes de mostrar la pregunta (ms). */
  duracionCelebracion: 1900,
} as const;
