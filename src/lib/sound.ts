/**
 * Sistema de sonido preparado para agregar audios más adelante.
 *
 * Mientras un sonido no tenga archivo asignado, `sound.play()` no hace nada.
 * Para activarlo: copiá el archivo en /public/sounds y completá su ruta
 * en SOURCES (por ejemplo `tick: "/sounds/tick.mp3"`).
 */

export type SoundName =
  | "tap" // toque de botón
  | "tick" // la aguja pasa por un sector de la ruleta
  | "spinStart" // empieza a girar la ruleta
  | "spinStop" // la ruleta se detiene
  | "categoryReveal" // celebración de la categoría elegida
  | "correct" // respuesta correcta
  | "wrong" // respuesta incorrecta
  | "streak" // racha
  | "gameOver"; // fin de partida

const SOURCES: Partial<Record<SoundName, string>> = {
  // tap: "/sounds/tap.mp3",
  // tick: "/sounds/tick.mp3",
  // spinStart: "/sounds/spin-start.mp3",
  // spinStop: "/sounds/spin-stop.mp3",
  // categoryReveal: "/sounds/category.mp3",
  // correct: "/sounds/correct.mp3",
  // wrong: "/sounds/wrong.mp3",
  // streak: "/sounds/streak.mp3",
  // gameOver: "/sounds/game-over.mp3",
};

const cache = new Map<SoundName, HTMLAudioElement>();
let muted = false;

export const sound = {
  play(name: SoundName, volume = 1): void {
    if (muted || typeof window === "undefined") return;
    const src = SOURCES[name];
    if (!src) return;

    let base = cache.get(name);
    if (!base) {
      base = new Audio(src);
      base.preload = "auto";
      cache.set(name, base);
    }
    // Clonamos para permitir sonidos superpuestos (por ejemplo, los ticks de la ruleta).
    const node = base.cloneNode(true) as HTMLAudioElement;
    node.volume = Math.max(0, Math.min(1, volume));
    void node.play().catch(() => {
      /* El navegador puede bloquear audio antes de la primera interacción. */
    });
  },

  setMuted(value: boolean): void {
    muted = value;
  },

  isMuted(): boolean {
    return muted;
  },
};
