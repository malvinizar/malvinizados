"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button3D } from "@/components/ui/Button3D";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Confetti } from "@/components/ui/Confetti";
import { CreamCard } from "@/components/ui/CreamCard";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { CATEGORY_BY_ID } from "@/config/categories";
import { Malvinometro } from "@/features/hud/Malvinometro";
import { SaveScoreForm } from "@/features/ranking/SaveScoreForm";
import { sound } from "@/lib/sound";
import type { CategoriaStats, GameStats } from "./stats";

interface GameOverProps {
  stats: GameStats;
  segundos: number;
  onRestart: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function CategoriaCard({ titulo, data, delay }: { titulo: string; data: CategoriaStats | null; delay: number }) {
  const cat = data ? CATEGORY_BY_ID[data.categoria] : null;
  return (
    <motion.div
      className="flex flex-col items-center gap-1 rounded-2xl border-[3px] border-cream-border bg-white/70 px-2 py-3 text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay }}
    >
      <span className="text-xs font-extrabold uppercase text-ink-soft">{titulo}</span>
      {cat && data ? (
        <>
          <CategoryBadge category={cat} size="sm" />
          <span className="font-display text-lg leading-tight text-ink">{cat.label}</span>
          <span className="text-xs font-bold text-ink-soft">
            {data.aciertos}/{data.respondidas} correctas
          </span>
        </>
      ) : (
        <span className="py-4 text-sm font-bold text-ink-soft">—</span>
      )}
    </motion.div>
  );
}

/** Resultados de la partida. */
export function GameOver({ stats, segundos, onRestart }: GameOverProps) {
  const buena = stats.malvinometro >= 60;

  useEffect(() => {
    sound.play(buena ? "victory" : "gameOver");
  }, [buena]);

  const resumen = [
    { label: "Aciertos", value: String(stats.aciertos), color: "text-futbol-dark" },
    { label: "Errores", value: String(stats.errores), color: "text-cine-dark" },
    { label: "Tiempo", value: formatTime(segundos), color: "text-navy-800" },
    { label: "Mejor racha", value: String(stats.mejorRacha), color: "text-musica-dark" },
  ];

  return (
    <motion.section className="flex w-full flex-col items-center gap-5 pt-4 lg:mx-auto lg:grid lg:h-full lg:max-w-[1600px] lg:grid-cols-[1fr_2.2fr] lg:items-center lg:gap-16 lg:pt-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Columna izquierda (en 1920×1080): nivel alcanzado */}
      <div className="flex flex-col items-center gap-5 lg:gap-8">
      {/* Nivel alcanzado */}
      <motion.div
        className="relative grid size-40 place-items-center lg:size-80"
        initial={{ scale: 0, rotate: -120 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 12 }}
      >
        <SolDeMayo className="absolute inset-0 size-full drop-shadow-[0_0_30px_rgba(255,200,60,0.65)]" withFace={false} />
        <div className="relative grid size-24 place-items-center rounded-full border-4 lg:size-44 lg:border-[6px] border-gold-dark bg-linear-to-b from-gold-light to-gold text-center shadow-[0_5px_0_var(--color-gold-dark)]">
          <span className="text-[10px] font-extrabold uppercase leading-none text-gold-ink lg:text-base">Nivel</span>
          <span className="font-display text-4xl leading-none text-gold-ink lg:text-8xl">{stats.nivelIndice + 1}</span>
        </div>
      </motion.div>

      <motion.p
        className="text-game -mt-2 text-center text-3xl leading-tight text-gold-light [--stroke-w:7px] [--drop:4px] lg:text-6xl lg:[--stroke-w:11px] lg:[--drop:6px]"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.3 }}
      >
        {stats.nivel.nombre}
      </motion.p>
      </div>

      <motion.div
        className="w-full"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.4 }}
      >
        <CreamCard title={buena ? "¡Gran partida!" : "¡Partida terminada!"} titleTone={buena ? "gold" : "celeste"} bodyClassName="lg:grid lg:grid-cols-2 lg:gap-x-10 lg:px-10 lg:pb-10 lg:pt-14">
          {/* Columna A: resultados */}
          <div>
          {/* Puntaje */}
          <div className="mb-4 text-center">
            <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">Puntaje</p>
            <AnimatedNumber value={stats.puntaje} duration={1.6} className="font-display text-5xl text-navy-800 lg:text-7xl" />
          </div>

          {/* Malvinómetro final (sobre fondo azul para que contraste) */}
          <div className="mb-4 rounded-2xl bg-navy-800 px-3 pb-4 pt-2">
            <Malvinometro valor={stats.malvinometro} nivelNombre={`${stats.malvinometro}%`} nivelIndice={stats.nivelIndice} />
          </div>

          <dl className="mb-4 grid grid-cols-2 gap-3 text-center lg:grid-cols-4">
            {resumen.map((s, i) => (
              <motion.div
                key={s.label}
                className="rounded-2xl border-[3px] border-cream-border bg-white/70 px-2 py-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 15, delay: 0.7 + i * 0.08 }}
              >
                <dt className="text-xs font-extrabold uppercase text-ink-soft">{s.label}</dt>
                <dd className={`font-display text-3xl ${s.color}`}>{s.value}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-0">
            <CategoriaCard titulo="Más fuerte" data={stats.fuerte} delay={1.05} />
            <CategoriaCard titulo="Para repasar" data={stats.debil} delay={1.15} />
          </div>
          </div>

          {/* Columna B: guardar en el ranking y botones */}
          <div className="lg:flex lg:flex-col lg:justify-between">

          <div className="mb-6 rounded-2xl border-[3px] border-dashed border-cream-border p-3">
            <SaveScoreForm
              datos={{
                puntaje: stats.puntaje,
                malvinometro: stats.malvinometro,
                nivel: stats.nivel.nombre,
                aciertos: stats.aciertos,
                total: stats.aciertos + stats.errores,
                duracionSeg: segundos,
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button3D size="lg" onClick={onRestart} pulse>
              Volver a jugar
            </Button3D>
            <Button3D variant="cream" href="/">
              Menú principal
            </Button3D>
          </div>
          </div>
        </CreamCard>
      </motion.div>

      {buena ? <Confetti burstKey="fin" count={70} /> : null}
    </motion.section>
  );
}
