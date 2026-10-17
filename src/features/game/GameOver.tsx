"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button3D } from "@/components/ui/Button3D";
import { Confetti } from "@/components/ui/Confetti";
import { CreamCard } from "@/components/ui/CreamCard";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { sound } from "@/lib/sound";
import type { AnswerRecord } from "./gameMachine";

interface GameOverProps {
  historial: AnswerRecord[];
  segundos: number;
  onRestart: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

/**
 * Pantalla de fin de partida provisoria.
 * En el paso 5 suma puntaje, Malvinómetro y categorías fuerte/débil.
 */
export function GameOver({ historial, segundos, onRestart }: GameOverProps) {
  const aciertos = historial.filter((h) => h.correcta).length;
  const errores = historial.length - aciertos;
  const buena = aciertos >= Math.ceil(historial.length * 0.6);

  useEffect(() => {
    sound.play(buena ? "victory" : "gameOver");
  }, [buena]);

  return (
    <motion.section
      className="flex w-full flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="size-32"
        initial={{ scale: 0, rotate: -120 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >
        <SolDeMayo className="size-full drop-shadow-[0_0_28px_rgba(255,200,60,0.6)]" />
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.2 }}
      >
        <CreamCard title={buena ? "¡Gran partida!" : "¡Partida terminada!"} titleTone={buena ? "gold" : "celeste"}>
          <dl className="mb-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Aciertos", value: aciertos, color: "text-futbol-dark" },
              { label: "Errores", value: errores, color: "text-cine-dark" },
              { label: "Tiempo", value: formatTime(segundos), color: "text-navy-800" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="rounded-2xl border-[3px] border-cream-border bg-white/70 px-2 py-3"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 15, delay: 0.45 + i * 0.1 }}
              >
                <dt className="text-xs font-extrabold uppercase text-ink-soft">{s.label}</dt>
                <dd className={`font-display text-3xl ${s.color}`}>{s.value}</dd>
              </motion.div>
            ))}
          </dl>
          <div className="flex flex-col gap-4">
            <Button3D size="lg" onClick={onRestart} pulse>
              Volver a jugar
            </Button3D>
            <Button3D variant="cream" href="/">
              Menú principal
            </Button3D>
          </div>
        </CreamCard>
      </motion.div>

      {buena ? <Confetti burstKey="fin" count={60} /> : null}
    </motion.section>
  );
}
