"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Button3D } from "@/components/ui/Button3D";
import { CreamCard } from "@/components/ui/CreamCard";

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  { n: 1, title: "Girá la ruleta", text: "Tocá el Sol de Mayo y mirá en qué categoría cae." },
  { n: 2, title: "Respondé", text: "Elegí una de las cuatro opciones. Después vas a ver la explicación y la fuente." },
  { n: 3, title: "Sumá puntos", text: "Las preguntas más difíciles valen más, y las rachas multiplican tu puntaje." },
  { n: 4, title: "Llená el Malvinómetro", text: "Cada acierto lo hace subir. ¿Hasta qué nivel llegás?" },
] as const;

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-title"
            className="w-full max-w-sm"
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CreamCard title="¿Cómo se juega?">
              <span id="how-to-title" className="sr-only">
                Cómo se juega
              </span>
              <ol className="mb-6 flex flex-col gap-3">
                {STEPS.map((step, i) => (
                  <motion.li
                    key={step.n}
                    className="flex items-start gap-3"
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border-[3px] border-gold-dark bg-gold font-display text-lg text-gold-ink shadow-[0_3px_0_var(--color-gold-dark)]">
                      {step.n}
                    </span>
                    <span>
                      <span className="block font-display text-lg leading-tight text-navy-800">{step.title}</span>
                      <span className="block text-sm font-semibold leading-snug text-ink-soft">{step.text}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
              <Button3D variant="green" size="lg" onClick={onClose}>
                ¡Entendido!
              </Button3D>
            </CreamCard>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
