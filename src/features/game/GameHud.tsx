"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { MuteButton } from "@/components/ui/MuteButton";
import { CATEGORIES } from "@/config/categories";
import { multiplicadorRacha } from "@/config/scoring";
import { Malvinometro } from "@/features/hud/Malvinometro";
import { cn } from "@/lib/cn";
import { sound } from "@/lib/sound";
import type { AnswerRecord } from "./gameMachine";
import type { GameStats } from "./stats";

interface GameHudProps {
  historial: AnswerRecord[];
  total: number;
  stats: GameStats;
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-gold-ink" fill="currentColor" aria-hidden>
      <path d="M12 3l2.1 4.6 5 .5-3.8 3.4 1.1 4.9L12 13.9 7.6 16.4l1.1-4.9L4.9 8.1l5-.5z" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-cine-dark" fill="currentColor" aria-hidden>
      <path d="M12 2c1 3.5 5 5.6 5 10.2A5.1 5.1 0 0 1 12 17.5a5.1 5.1 0 0 1-5-5.3c0-2 1-3.4 2-4.5.2 1.6.9 2.7 2 3.2-.3-3.4.4-6.3 1-8.9Zm0 20a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-futbol-dark" fill="currentColor" aria-hidden>
      <path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z" />
    </svg>
  );
}

function Pill({ icon, children, label, highlight }: { icon: React.ReactNode; children: React.ReactNode; label: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-10 min-w-0 flex-1 items-center gap-1.5 rounded-full border-[3px] border-cream-border bg-cream px-2 font-display text-lg text-ink shadow-[0_3px_0_var(--color-cream-edge)] transition-colors",
        highlight && "border-gold-dark bg-gold-light",
      )}
      aria-label={label}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/80">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

/** Barra superior del juego: progreso, Malvinómetro, puntaje, racha y aciertos. */
export function GameHud({ historial, total, stats }: GameHudProps) {
  const mult = stats.racha > 0 ? multiplicadorRacha(stats.racha) : 1;
  const [nivelUp, setNivelUp] = useState<string | null>(null);
  const prevNivel = useRef(stats.nivelIndice);
  const prevRacha = useRef(stats.racha);

  // Aviso de subida de nivel.
  useEffect(() => {
    if (stats.nivelIndice > prevNivel.current) {
      setNivelUp(stats.nivel.nombre);
      const t = window.setTimeout(() => setNivelUp(null), 2200);
      prevNivel.current = stats.nivelIndice;
      return () => window.clearTimeout(t);
    }
    prevNivel.current = stats.nivelIndice;
  }, [stats.nivelIndice, stats.nivel.nombre]);

  // Sonido cuando se activa o sube el multiplicador de racha.
  useEffect(() => {
    if (stats.racha > prevRacha.current && (stats.racha === 3 || stats.racha === 5)) {
      window.setTimeout(() => sound.play("streak"), 700);
    }
    prevRacha.current = stats.racha;
  }, [stats.racha]);

  return (
    <header className="relative flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-cream-border bg-cream text-ink shadow-[0_3px_0_var(--color-cream-edge)]"
          aria-label="Volver al menú"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
            <path d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" />
          </svg>
        </Link>

        {/* Progreso: una bolita por pregunta */}
        <ol
          className="flex flex-1 items-center justify-center gap-1"
          aria-label={`Pregunta ${Math.min(historial.length + 1, total)} de ${total}`}
        >
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
      </div>

      <Malvinometro valor={stats.malvinometro} nivelNombre={stats.nivel.nombre} nivelIndice={stats.nivelIndice} />

      <div className="flex gap-2">
        <Pill icon={<CoinIcon />} label={`Puntaje: ${stats.puntaje}`}>
          <AnimatedNumber value={stats.puntaje} />
        </Pill>
        <Pill icon={<FlameIcon />} label={`Racha: ${stats.racha}`} highlight={mult > 1}>
          {stats.racha}
          {mult > 1 ? <span className="ml-1 text-sm text-cine-dark">×{mult}</span> : null}
        </Pill>
        <Pill icon={<CheckIcon />} label={`Aciertos: ${stats.aciertos}`}>
          {stats.aciertos}
        </Pill>
      </div>

      {/* Aviso de nivel */}
      <AnimatePresence>
        {nivelUp ? (
          <motion.div
            key={nivelUp}
            className="pointer-events-none absolute inset-x-0 top-full z-40 mt-2 flex justify-center"
            initial={{ y: -20, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 16 }}
            role="status"
          >
            <div className="rounded-2xl border-4 border-gold-dark bg-gold-light px-4 py-2 text-center shadow-[0_5px_0_var(--color-gold-dark)]">
              <p className="text-xs font-extrabold uppercase text-gold-ink">¡Subiste de nivel!</p>
              <p className="font-display text-xl text-gold-ink">{nivelUp}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
