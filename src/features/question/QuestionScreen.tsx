"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button3D } from "@/components/ui/Button3D";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Confetti } from "@/components/ui/Confetti";
import { Ribbon } from "@/components/ui/Ribbon";
import { CATEGORY_BY_ID } from "@/config/categories";
import { correctDisplayIndex, type AnswerRecord, type CurrentQuestion } from "@/features/game/gameMachine";
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
  /** Resultado registrado de esta pregunta (puntos, racha), una vez respondida. */
  resultado: AnswerRecord | null;
}

const LETTERS = ["a", "b", "c", "d"];
const noopSubscribe = () => () => {};

export function QuestionScreen({ current, elegida, numero, total, onAnswer, onContinue, esUltima, resultado }: QuestionScreenProps) {
  const { pregunta, orden } = current;
  const category = CATEGORY_BY_ID[pregunta.categoria];
  const correcta = correctDisplayIndex(current);
  const respondida = elegida !== null;
  const acerto = respondida && elegida === correcta;
  const continuarRef = useRef<HTMLDivElement>(null);
  // true solo en el cliente (el portal necesita document.body).
  const montado = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!respondida) return;
    sound.play(acerto ? "correct" : "wrong");
    // Bloquear el scroll de la página mientras el cartel está abierto.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => continuarRef.current?.querySelector<HTMLElement>("button, a")?.focus({ preventScroll: true }), 700);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
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

      {/* Resultado + explicación: cartel modal por encima de la pregunta */}
      {montado
        ? createPortal(
            <>
              <AnimatePresence>
                {respondida ? (
                  <motion.div
                    key="feedback-overlay"
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-900/55 p-4 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.25, delay: 0.45 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="feedback-titulo"
                  >
                    <motion.div
                      className="relative my-auto w-full max-w-md pt-6"
                      initial={{ y: 60, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                      aria-live="polite"
                    >
                      <div className="absolute inset-x-0 top-0 z-10">
                        <Ribbon as="p" tone={acerto ? "gold" : "celeste"} className="w-[min(17rem,85%)]">
                          <span id="feedback-titulo">{acerto ? "¡Correcto!" : "¡Casi!"}</span>
                        </Ribbon>
                      </div>
                      <div className="cream-card flex flex-col gap-3 px-5 pb-5 pt-9 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                        {acerto && resultado ? (
                          <motion.div
                            className="flex flex-wrap items-center justify-center gap-2"
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 420, damping: 12, delay: 0.7 }}
                          >
                            <span className="text-game text-3xl text-gold-light [--stroke-w:6px] [--drop:3px]">
                              +{resultado.puntos}
                            </span>
                            {resultado.multiplicador > 1 ? (
                              <span className="rounded-full border-[3px] border-cine-dark bg-cine px-3 py-0.5 font-display text-sm uppercase text-white">
                                ¡Racha de {resultado.racha}! ×{resultado.multiplicador}
                              </span>
                            ) : null}
                          </motion.div>
                        ) : null}
                        {!acerto ? (
                          <p className="text-sm font-bold text-ink">
                            La respuesta correcta era: <span className="text-futbol-dark">{pregunta.opciones[pregunta.correcta]}</span>
                          </p>
                        ) : null}
                        <p className="text-base font-semibold leading-relaxed text-ink">{pregunta.explicacion}</p>
                        <SourceLine fuente={pregunta.fuente} />
                        <div ref={continuarRef} className="mt-1 flex flex-col">
                          <Button3D variant={esUltima ? "yellow" : "green"} onClick={onContinue}>
                            {esUltima ? "Ver resultados" : "Continuar"}
                          </Button3D>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              {acerto ? <Confetti burstKey={pregunta.id} count={36} /> : null}
            </>,
            document.body,
          )
        : null}
    </motion.section>
  );
}
