"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MuteButton } from "@/components/ui/MuteButton";
import { CATEGORIES } from "@/config/categories";
import type { AnswerRecord } from "./gameMachine";

interface GameHudProps {
  historial: AnswerRecord[];
  total: number;
}

/**
 * Barra superior provisoria: progreso de la partida y aciertos.
 * En el paso 5 se reemplaza por el Malvinómetro con puntaje y racha.
 */
export function GameHud({ historial, total }: GameHudProps) {
  const aciertos = historial.filter((h) => h.correcta).length;

  return (
    <header className="flex w-full items-center gap-2">
      <Link
        href="/"
        className="grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-cream-border bg-cream text-ink shadow-[0_3px_0_var(--color-cream-edge)]"
        aria-label="Volver al menú"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
          <path d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" />
        </svg>
      </Link>

      {/* Progreso: una bolita por pregunta, coloreada según la categoría y el resultado */}
      <ol className="flex flex-1 items-center justify-center gap-1" aria-label={`Pregunta ${Math.min(historial.length + 1, total)} de ${total}`}>
        {Array.from({ length: total }, (_, i) => {
          const h = historial[i];
          const cat = h ? CATEGORIES.find((c) => c.id === h.categoria) : undefined;
          return (
            <motion.li
              key={i}
              className="size-3 rounded-full border-2 border-white/60"
              style={{ background: h ? (h.correcta ? cat?.color : "#6b7a99") : "rgba(255,255,255,0.12)" }}
              initial={false}
              animate={h ? { scale: [1.6, 1] } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            />
          );
        })}
      </ol>

      <MuteButton />

      <div className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border-[3px] border-cream-border bg-cream px-3 font-display text-lg text-ink shadow-[0_3px_0_var(--color-cream-edge)]">
        <span className="text-futbol-dark" aria-hidden>
          ✓
        </span>
        <span aria-label={`${aciertos} aciertos`}>{aciertos}</span>
      </div>
    </header>
  );
}
