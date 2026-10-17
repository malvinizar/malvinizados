"use client";

import { motion } from "framer-motion";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { Ribbon } from "@/components/ui/Ribbon";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  /** Versión compacta para encabezados. */
  compact?: boolean;
}

/** Logo MalvinizAR: Sol de Mayo detrás, palabra con contorno y cinta celeste. */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <motion.div
        className={cn("absolute left-1/2 -translate-x-1/2", compact ? "-top-6 size-24" : "-top-14 size-44 sm:size-52")}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}
      >
        <motion.div
          className="size-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          <SolDeMayo className="size-full drop-shadow-[0_0_28px_rgba(255,200,60,0.55)]" />
        </motion.div>
      </motion.div>

      <motion.h1
        className={cn(
          "text-game relative leading-none text-gold-light",
          compact ? "text-4xl [--stroke-w:5px] [--drop:3px]" : "text-[clamp(3.25rem,15vw,5rem)] [--stroke-w:9px] [--drop:6px]",
        )}
        initial={{ y: -60, scale: 0.6, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.35 }}
      >
        Malviniz<span className="text-celeste-light">AR</span>
      </motion.h1>

      {!compact ? (
        <motion.div
          className="relative -mt-1 w-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.6 }}
        >
          <Ribbon as="p" className="w-[min(19rem,88vw)]">
            La trivia de Malvinas
          </Ribbon>
        </motion.div>
      ) : null}
    </div>
  );
}
