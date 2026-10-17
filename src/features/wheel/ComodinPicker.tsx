"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Confetti } from "@/components/ui/Confetti";
import { CreamCard } from "@/components/ui/CreamCard";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { CATEGORIES, type CategoriaId } from "@/config/categories";
import { sound } from "@/lib/sound";

interface ComodinPickerProps {
  /** Categorías que todavía tienen preguntas disponibles. */
  available: CategoriaId[];
  onPick: (categoria: CategoriaId) => void;
}

/** Sector Sol de Mayo: el jugador elige la categoría. */
export function ComodinPicker({ available, onPick }: ComodinPickerProps) {
  useEffect(() => {
    sound.play("categoryReveal");
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-navy-950/85 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="size-36 lg:size-56"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        <SolDeMayo className="size-full drop-shadow-[0_0_30px_rgba(255,200,60,0.7)]" />
      </motion.div>

      <motion.div
        className="w-full max-w-sm lg:max-w-2xl"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <CreamCard title="¡Comodín!" titleTone="gold">
          <p className="mb-4 text-center font-bold text-ink-soft">Cayó el Sol de Mayo: elegí la categoría.</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => {
              const enabled = available.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  disabled={!enabled}
                  onClick={() => {
                    sound.play("tap");
                    onPick(c.id);
                  }}
                  className="rounded-2xl p-2 text-ink transition-opacity focus-visible:outline-4 focus-visible:outline-navy-700 disabled:opacity-35"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.35 + i * 0.07 }}
                  whileHover={enabled ? { scale: 1.08 } : undefined}
                  whileTap={enabled ? { scale: 0.92 } : undefined}
                  aria-label={`Elegir ${c.label}`}
                >
                  <CategoryBadge category={c} size="md" />
                  <span className="mt-2 block font-display text-lg uppercase">{c.label}</span>
                </motion.button>
              );
            })}
          </div>
        </CreamCard>
      </motion.div>

      <Confetti burstKey="comodin" />
    </motion.div>
  );
}
