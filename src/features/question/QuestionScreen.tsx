"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button3D } from "@/components/ui/Button3D";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Confetti } from "@/components/ui/Confetti";
import { Ribbon } from "@/components/ui/Ribbon";
import { CATEGORY_BY_ID } from "@/config/categories";
import { correctDisplayIndex, type CurrentQuestion } from "@/features/game/gameMachine";
import { sound } from "@/lib/sound";
import { AnswerButton, type AnswerState } from "./AnswerButton";
import { MediaRenderer } from "./MediaRenderer";
import { SourceLine } from "./SourceLine";

interface QuestionScreenProps {
  current: CurrentQuestion;
  /** Índice elegido (en el orden mostrado) o null si todavía no respondió. */
  elegida: number | null;
  numero: number;
  total: number;
  onAnswer: (index: number) => void;
  onContinue: () => void;
  esUltima: boolean;
}

const LETTERS = ["a", "b", "c", "d"];

export function QuestionScreen({ current, elegida, numero, total, onAnswer, onContinue, esUltima }: QuestionScreenProps) {
  const { pregunta, orden } = current;
  const category = CATEGORY_BY_ID[pregunta.categoria];
  const correcta = correctDisplayIndex(current);
  const respondida = elegida !== null;
  const acerto = respondida && elegida === correcta;
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!respondida) return;
    sound.play(acerto ? "correct" : "wrong");
    // En pantallas chicas, llevar la explicación a la vista.
    const t = window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 350);
    return () => window.clearTimeout(t);
  }, [respondida, acerto]);

  const stateFor = (i: number): AnswerState => {
    if (!respondida) return "idle";
    if (i === correcta) return "correct";
    if (i === elegida) return "wrong";
    return "dimmed";
  };

  return (
    <motion.section
      className="flex w-full flex-col gap-4"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      aria-labelledby="pregunta-texto"
    >
      {/* Arriba: categoría */}
      <div
        className="flex items-center gap-3 rounded-2xl border-4 px-3 py-2 shadow-[0_5px_0_rgba(0,0,0,0.3)]"
        style={{ background: category.color, borderColor: category.colorDark }}
      >
        <CategoryBadge category={category} size="sm" />
        <span className="text-game flex-1 text-2xl uppercase text-white [--stroke-c:rgba(10,26,58,0.55)] [--stroke-w:5px] [--drop:2px]">
          {category.label}
        </span>
        <span className="rounded-full bg-white/25 px-3 py-1 font-display text-sm text-white">
          {numero}/{total}
        </span>
      </div>

      {/* Pregunta */}
      <motion.div
        className="cream-card px-5 py-5"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.08 }}
      >
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-ink-soft">
          <span>Dificultad: {pregunta.dificultad}</span>
        </div>
        <h2 id="pregunta-texto" className="text-xl font-extrabold leading-snug text-navy-900 sm:text-2xl">
          {pregunta.pregunta}
        </h2>
      </motion.div>

      {/* Centro: multimedia */}
      <MediaRenderer media={pregunta.media} />

      {/* Abajo: respuestas */}
      <div className="flex flex-col gap-3" role="group" aria-label="Opciones">
        {orden.map((idx, i) => (
          <AnswerButton
            key={`${pregunta.id}-${idx}`}
            index={i}
            letter={LETTERS[i]}
            label={pregunta.opciones[idx]}
            state={stateFor(i)}
            disabled={respondida}
            onClick={() => onAnswer(i)}
          />
        ))}
      </div>

      {/* Resultado + explicación */}
      <AnimatePresence>
        {respondida ? (
          <motion.div
            ref={feedbackRef}
            className="relative pt-6"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.35 }}
            aria-live="polite"
          >
            <div className="absolute inset-x-0 top-0 z-10">
              <Ribbon as="p" tone={acerto ? "gold" : "celeste"} className="w-[min(17rem,85%)]">
                {acerto ? "¡Correcto!" : "¡Casi!"}
              </Ribbon>
            </div>
            <div className="cream-card flex flex-col gap-3 px-5 pb-5 pt-9">
              {!acerto ? (
                <p className="text-sm font-bold text-ink">
                  La respuesta correcta era: <span className="text-futbol-dark">{pregunta.opciones[pregunta.correcta]}</span>
                </p>
              ) : null}
              <p className="text-base font-semibold leading-relaxed text-ink">{pregunta.explicacion}</p>
              <SourceLine fuente={pregunta.fuente} />
              <Button3D variant={esUltima ? "yellow" : "green"} onClick={onContinue} className="mt-1">
                {esUltima ? "Ver resultados" : "Continuar"}
              </Button3D>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {acerto ? <Confetti burstKey={pregunta.id} count={36} /> : null}
    </motion.section>
  );
}
