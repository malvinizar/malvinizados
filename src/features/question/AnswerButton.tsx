"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type AnswerState = "idle" | "correct" | "wrong" | "dimmed";

interface AnswerButtonProps {
  label: string;
  letter: string;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
  index: number;
}

const stateClass: Record<AnswerState, string> = {
  idle: "btn3d-cream",
  correct: "btn3d-green",
  wrong: "btn3d-red",
  dimmed: "btn3d-cream opacity-60",
};

/** Botón grande de respuesta: cambia a verde/rojo al responder. */
export function AnswerButton({ label, letter, state, disabled, onClick, index }: AnswerButtonProps) {
  return (
    <motion.div
      initial={{ x: index % 2 === 0 ? -40 : 40, opacity: 0 }}
      animate={
        state === "wrong"
          ? { x: [0, -10, 10, -7, 7, 0], opacity: 1 }
          : state === "correct"
            ? { x: 0, opacity: 1, scale: [1, 1.06, 1] }
            : { x: 0, opacity: 1 }
      }
      transition={
        state === "idle"
          ? { type: "spring", stiffness: 300, damping: 22, delay: 0.25 + index * 0.07 }
          : { duration: 0.45 }
      }
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "btn3d min-h-14 justify-start px-3 py-2 text-left normal-case tracking-normal disabled:cursor-default lg:min-h-20 lg:gap-4 lg:px-5",
          stateClass[state],
        )}
        style={{ fontFamily: "var(--font-sans)", textShadow: "none" }}
      >
        <span
          className={cn(
            "relative grid size-9 shrink-0 place-items-center rounded-full border-[3px] font-display text-lg uppercase lg:size-12 lg:text-2xl",
            state === "correct" || state === "wrong"
              ? "border-white/70 bg-white/25 text-white"
              : "border-cream-border bg-white text-navy-800",
          )}
        >
          {state === "correct" ? "✓" : state === "wrong" ? "✕" : letter}
        </span>
        <span className="relative text-base font-extrabold leading-snug sm:text-lg lg:text-2xl">{label}</span>
      </button>
    </motion.div>
  );
}
