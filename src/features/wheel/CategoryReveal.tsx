"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Confetti } from "@/components/ui/Confetti";
import type { CategoryDef } from "@/config/categories";
import { GAME_CONFIG } from "@/config/game";
import { sound } from "@/lib/sound";

interface CategoryRevealProps {
  category: CategoryDef;
  onDone: () => void;
}

/**
 * "Pantalla propia" de cada categoría: celebración con el medallón,
 * rayos de su color y confetti. Pasa sola a la pregunta (o con un toque).
 */
export function CategoryReveal({ category, onDone }: CategoryRevealProps) {
  useEffect(() => {
    sound.play("categoryReveal");
    const t = window.setTimeout(onDone, GAME_CONFIG.duracionCelebracion);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
      style={{ background: `radial-gradient(circle at 50% 42%, ${category.color}ee 0%, ${category.colorDark}f2 55%, #0a1a3af5 100%)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      onClick={onDone}
      role="status"
      aria-live="polite"
    >
      {/* Rayos girando detrás del medallón */}
      <motion.div
        className="absolute left-1/2 top-[42%] aspect-square w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          background: "repeating-conic-gradient(from 0deg, #ffffff 0deg 9deg, transparent 9deg 22deg)",
          maskImage: "radial-gradient(circle, black 0%, transparent 45%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 45%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        aria-hidden
      />

      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -200 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 13 }}
      >
        <CategoryBadge category={category} size="lg" className="scale-125 lg:scale-[2.2]" />
      </motion.div>

      <motion.p
        className="text-game relative text-5xl uppercase text-white [--stroke-c:rgba(10,26,58,0.85)] [--stroke-w:8px] lg:mt-16 lg:text-9xl lg:[--stroke-w:14px]"
        initial={{ y: 40, opacity: 0, scale: 0.6 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.25 }}
      >
        {category.label}
      </motion.p>

      <Confetti colors={[category.color, category.colorLight, "#ffffff", "#f5b921"]} burstKey={category.id} />
    </motion.div>
  );
}
