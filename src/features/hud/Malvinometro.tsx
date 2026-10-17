"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { NIVELES } from "@/config/scoring";
import { cn } from "@/lib/cn";

interface MalvinometroProps {
  /** 0 a 100 */
  valor: number;
  nivelNombre: string;
  nivelIndice: number;
  size?: "md" | "lg";
  className?: string;
}

/**
 * Barra del Malvinómetro: se llena con las respuestas correctas.
 * Marca los cortes de cada nivel y lleva un Sol de Mayo en la punta.
 */
export function Malvinometro({ valor, nivelNombre, nivelIndice, size = "md", className }: MalvinometroProps) {
  const pct = Math.max(0, Math.min(100, valor));
  const lg = size === "lg";

  return (
    <div className={cn("w-full", className)} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`Malvinómetro: ${pct}%, nivel ${nivelNombre}`}>
      <div className="mb-1 flex items-end justify-between gap-2 px-1">
        <span className={cn("font-display uppercase tracking-wide text-celeste-light drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]", lg ? "text-base" : "text-xs lg:text-base")}>
          Malvinómetro
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={nivelNombre}
            className={cn("text-game text-gold-light [--stroke-w:4px] [--drop:2px]", lg ? "text-xl" : "text-sm lg:text-2xl")}
            initial={{ y: 12, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 16 }}
          >
            {nivelNombre}
          </motion.span>
        </AnimatePresence>
      </div>

      <div
        className={cn(
          "relative rounded-full border-[3px] border-gold-dark bg-navy-950 shadow-[0_4px_0_var(--color-gold-dark),inset_0_3px_6px_rgba(0,0,0,0.6)]",
          lg ? "h-8" : "h-6 lg:h-9",
        )}
      >
        {/* Relleno */}
        <motion.div
          className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
          initial={false}
          animate={{ width: `${Math.max(pct, 0)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-celeste via-celeste-light to-gold-light" />
          <div className="absolute inset-x-1 top-0.5 h-1/3 rounded-full bg-white/50" />
        </motion.div>

        {/* Cortes de nivel */}
        {NIVELES.slice(1).map((n, i) => (
          <span
            key={n.nombre}
            className={cn(
              "absolute inset-y-1 w-[3px] -translate-x-1/2 rounded-full",
              i + 1 <= nivelIndice ? "bg-white/70" : "bg-white/20",
            )}
            style={{ left: `${n.desde}%` }}
            aria-hidden
          />
        ))}

        {/* Sol en la punta */}
        <motion.div
          className={cn("absolute top-1/2 -translate-x-1/2 -translate-y-1/2", lg ? "size-14" : "size-10 lg:size-16")}
          initial={false}
          animate={{ left: `${Math.max(pct, 3)}%`, rotate: pct * 3.6 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          aria-hidden
        >
          <SolDeMayo className="size-full drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]" withFace={lg} />
        </motion.div>
      </div>
    </div>
  );
}
