/**
 * Sonidos del juego generados por código con Web Audio.
 * Todos son originales: no usan grabaciones ni efectos de otros juegos.
 */

type Wave = OscillatorType;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

/** Crea (o reanuda) el contexto de audio. Debe llamarse a partir de un toque del usuario. */
export function getAudio(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    // Compresor suave para que los sonidos superpuestos no saturen.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return master ? { ctx, out: master } : null;
}

function noise(c: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

interface ToneOpts {
  freq: number;
  to?: number; // frecuencia final (glissando)
  at?: number; // segundos desde ahora
  dur: number;
  type?: Wave;
  gain?: number;
  attack?: number;
}

function tone(out: AudioNode, c: AudioContext, o: ToneOpts) {
  const t0 = c.currentTime + (o.at ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
  const peak = o.gain ?? 0.3;
  const attack = o.attack ?? 0.005;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g).connect(out);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.02);
}

/** Campana: fundamental + parcial inarmónico, con caída larga. */
function bell(out: AudioNode, c: AudioContext, freq: number, at: number, dur = 0.7, gain = 0.25) {
  tone(out, c, { freq, at, dur, gain, type: "sine", attack: 0.002 });
  tone(out, c, { freq: freq * 2.76, at, dur: dur * 0.5, gain: gain * 0.35, type: "sine", attack: 0.002 });
  tone(out, c, { freq: freq * 5.4, at, dur: dur * 0.25, gain: gain * 0.15, type: "sine", attack: 0.001 });
}

interface NoiseOpts {
  at?: number;
  dur: number;
  gain?: number;
  filter?: BiquadFilterType;
  freq: number;
  freqTo?: number;
  q?: number;
}

function burst(out: AudioNode, c: AudioContext, o: NoiseOpts) {
  const t0 = c.currentTime + (o.at ?? 0);
  const src = c.createBufferSource();
  src.buffer = noise(c);
  const f = c.createBiquadFilter();
  f.type = o.filter ?? "bandpass";
  f.frequency.setValueAtTime(o.freq, t0);
  if (o.freqTo) f.frequency.exponentialRampToValueAtTime(o.freqTo, t0 + o.dur);
  f.Q.value = o.q ?? 1;
  const g = c.createGain();
  const peak = o.gain ?? 0.3;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.02, o.dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(f).connect(g).connect(out);
  src.start(t0);
  src.stop(t0 + o.dur + 0.02);
}

/**
 * "¡Cha-ching!" de monedas, original, estilo caja registradora:
 * "cha" = golpe metálico; "ching" = dos campanas brillantes + lluvia de monedas.
 */
function chaChing(out: AudioNode, c: AudioContext, at = 0) {
  burst(out, c, { at, dur: 0.07, freq: 6000, filter: "highpass", gain: 0.3 });
  tone(out, c, { freq: 420, to: 300, at, dur: 0.06, type: "square", gain: 0.06 });
  bell(out, c, 1567.98, at + 0.09, 0.8, 0.26); // G6
  bell(out, c, 2093.0, at + 0.16, 0.9, 0.24); // C7
  for (let i = 0; i < 6; i++) {
    bell(out, c, 2600 + Math.random() * 1800, at + 0.22 + i * 0.045 + Math.random() * 0.02, 0.18, 0.05);
  }
}

/* ------------------------------------------------------------------ */
/* Sonidos                                                            */
/* ------------------------------------------------------------------ */

let lastTick = 0;

export const SYNTHS = {
  /** Toque de botón: "pop" corto. */
  tap(out: AudioNode, c: AudioContext) {
    tone(out, c, { freq: 520, to: 820, dur: 0.08, type: "sine", gain: 0.22 });
  },

  /** Aguja de la ruleta pasando por un sector: "tac" seco. */
  tick(out: AudioNode, c: AudioContext) {
    if (c.currentTime - lastTick < 0.035) return; // a máxima velocidad no saturar
    lastTick = c.currentTime;
    burst(out, c, { dur: 0.03, freq: 3200, q: 3, gain: 0.35 });
    tone(out, c, { freq: 1900, to: 1200, dur: 0.025, type: "square", gain: 0.05 });
  },

  /** Arranque de la ruleta: "fiuuu" que sube. */
  spinStart(out: AudioNode, c: AudioContext) {
    burst(out, c, { dur: 0.55, freq: 350, freqTo: 2600, q: 1.4, gain: 0.32 });
    tone(out, c, { freq: 180, to: 520, dur: 0.45, type: "triangle", gain: 0.12 });
  },

  /** La ruleta frena: golpe grave + campanita. */
  spinStop(out: AudioNode, c: AudioContext) {
    tone(out, c, { freq: 150, to: 70, dur: 0.22, type: "sine", gain: 0.5 });
    burst(out, c, { dur: 0.06, freq: 900, q: 1, gain: 0.25 });
    bell(out, c, 1318.5, 0.05, 0.5, 0.16);
  },

  /** Celebración de la categoría: arpegio ascendente con brillo. */
  categoryReveal(out: AudioNode, c: AudioContext) {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(out, c, { freq: f, at: i * 0.08, dur: 0.28, type: "triangle", gain: 0.22 }),
    );
    bell(out, c, 2093, 0.34, 0.6, 0.12);
  },

  /** Respuesta correcta: "¡cha-ching!" de monedas. */
  correct(out: AudioNode, c: AudioContext) {
    chaChing(out, c);
  },

  /** Respuesta incorrecta: "bu-buuu" descendente. */
  wrong(out: AudioNode, c: AudioContext) {
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    lp.connect(out);
    tone(lp, c, { freq: 311, to: 293, dur: 0.22, type: "sawtooth", gain: 0.2 });
    tone(lp, c, { freq: 233, to: 175, at: 0.24, dur: 0.45, type: "sawtooth", gain: 0.22 });
    tone(out, c, { freq: 117, to: 87, at: 0.24, dur: 0.45, type: "sine", gain: 0.25 });
  },

  /** Racha: escalita rápida hacia arriba. */
  streak(out: AudioNode, c: AudioContext) {
    [659.25, 783.99, 987.77, 1318.5, 1567.98].forEach((f, i) =>
      tone(out, c, { freq: f, at: i * 0.05, dur: 0.16, type: "square", gain: 0.07 }),
    );
  },

  /** Victoria (fin de partida con buen resultado): fanfarria + cha-ching. */
  victory(out: AudioNode, c: AudioContext) {
    const notes: Array<[number, number, number]> = [
      [392.0, 0, 0.14],
      [523.25, 0.14, 0.14],
      [659.25, 0.28, 0.14],
      [783.99, 0.42, 0.3],
      [659.25, 0.72, 0.12],
      [783.99, 0.84, 0.9],
    ];
    notes.forEach(([f, at, dur]) => {
      tone(out, c, { freq: f, at, dur, type: "square", gain: 0.08, attack: 0.01 });
      tone(out, c, { freq: f, at, dur, type: "triangle", gain: 0.18, attack: 0.01 });
    });
    // Acorde final
    [523.25, 659.25, 783.99, 1046.5].forEach((f) =>
      tone(out, c, { freq: f, at: 0.84, dur: 1.1, type: "triangle", gain: 0.1, attack: 0.02 }),
    );
    chaChing(out, c, 1.45);
  },

  /** Fin de partida sin tanta suerte: cierre amable, sin dramatismo. */
  gameOver(out: AudioNode, c: AudioContext) {
    [523.25, 440.0, 392.0, 523.25].forEach((f, i) =>
      tone(out, c, { freq: f, at: i * 0.16, dur: i === 3 ? 0.6 : 0.18, type: "triangle", gain: 0.2 }),
    );
  },
} satisfies Record<string, (out: AudioNode, c: AudioContext) => void>;

export type SynthName = keyof typeof SYNTHS;
