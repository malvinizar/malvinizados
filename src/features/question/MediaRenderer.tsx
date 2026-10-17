"use client";

import type { PreguntaMedia } from "@/features/questions/types";

/** Extrae el ID de un link de YouTube (watch, youtu.be, shorts o embed). */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

const isDev = process.env.NODE_ENV !== "production";

/**
 * Muestra el recurso multimedia de la pregunta según su tipo.
 * Si la URL está vacía: en desarrollo muestra un aviso; en producción no muestra nada.
 */
export function MediaRenderer({ media }: { media: PreguntaMedia }) {
  if (media.tipo === "none") return null;

  const url = media.url.trim();
  if (!url) {
    return isDev ? (
      <div className="grid aspect-video w-full place-items-center rounded-2xl border-4 border-dashed border-cream-border bg-cream-200/60 p-4 text-center text-sm font-bold text-ink-soft">
        Recurso «{media.tipo}» pendiente: falta completar la URL en preguntas.json
      </div>
    ) : null;
  }

  const frame = "w-full overflow-hidden rounded-2xl border-4 border-cream-border bg-navy-950 shadow-[0_6px_0_var(--color-cream-edge)]";

  switch (media.tipo) {
    case "youtube": {
      const id = youtubeId(url);
      if (!id) return null;
      return (
        <div className={`${frame} aspect-video`}>
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`}
            title="Video de la pregunta"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    case "image":
      return (
        <div className={frame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Imagen de la pregunta" className="max-h-64 w-full object-contain" />
        </div>
      );
    case "audio":
      return (
        <div className="w-full rounded-2xl border-4 border-cream-border bg-cream p-3">
          <audio controls src={url} className="w-full">
            Tu navegador no puede reproducir este audio.
          </audio>
        </div>
      );
    case "iframe":
      return (
        <div className={`${frame} aspect-video`}>
          <iframe className="size-full" src={url} title="Recurso de la pregunta" allowFullScreen />
        </div>
      );
    default:
      return null;
  }
}
