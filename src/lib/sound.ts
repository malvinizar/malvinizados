/**
 * Sonidos del juego.
 *
 * Por defecto se generan por código (ver synth.ts), así que funcionan sin archivos.
 * Si más adelante querés reemplazar alguno por una grabación propia, copiá el archivo
 * en /public/sounds y completá su ruta en SOURCES (por ejemplo `tick: "/sounds/tick.mp3"`).
 */

import { getAudio, SYNTHS, type SynthName } from "./synth";

export type SoundName = SynthName;
// Nombres: tap · tick · spinStart · spinStop · categoryReveal · correct · wrong · streak · victory · gameOver

const SOURCES: Partial<Record<SoundName, string>> = {
  // correct: "/sounds/correct.mp3",
};

const MUTE_KEY = "malvinizar:mute";
const cache = new Map<SoundName, HTMLAudioElement>();

let muted = false;
if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    /* almacenamiento no disponible: queda con sonido */
  }
}

const listeners = new Set<(muted: boolean) => void>();

function playFile(name: SoundName, src: string, volume: number) {
  let base = cache.get(name);
  if (!base) {
    // En GitHub Pages el sitio vive bajo un subdirectorio (/malvinizados).
    base = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`);
    base.preload = "auto";
    cache.set(name, base);
  }
  const node = base.cloneNode(true) as HTMLAudioElement;
  node.volume = Math.max(0, Math.min(1, volume));
  void node.play().catch(() => {
    /* El navegador puede bloquear audio antes de la primera interacción. */
  });
}

export const sound = {
  play(name: SoundName, volume = 1): void {
    if (muted || typeof window === "undefined") return;
    const src = SOURCES[name];
    if (src) {
      playFile(name, src, volume);
      return;
    }
    const audio = getAudio();
    if (!audio) return;
    // Un nodo de volumen por sonido para respetar `volume`.
    const g = audio.ctx.createGain();
    g.gain.value = Math.max(0, Math.min(1, volume));
    g.connect(audio.out);
    SYNTHS[name](g, audio.ctx);
  },

  setMuted(value: boolean): void {
    muted = value;
    try {
      window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
    } catch {
      /* sin almacenamiento: se aplica solo en esta visita */
    }
    listeners.forEach((fn) => fn(muted));
  },

  isMuted(): boolean {
    return muted;
  },

  subscribe(fn: (muted: boolean) => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
