"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ConfettiProps {
  colors?: string[];
  count?: number;
  /** Cambiarlo dispara una nueva lluvia. */
  burstKey?: string | number;
}

const DEFAULT_COLORS = ["#f5b921", "#7ec8f0", "#ffffff", "#e8483b", "#2db34a", "#8e5bd9"];

/** Lluvia de papelitos liviana, sin dependencias. */
export function Confetti({ colors = DEFAULT_COLORS, count = 42, burstKey = 0 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `${burstKey}-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 1.6 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() - 0.5) * 900,
        w: 7 + Math.random() * 7,
        h: 10 + Math.random() * 10,
        color: colors[i % colors.length],
        round: Math.random() < 0.3,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burstKey, count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
          }}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", x: p.drift, rotate: p.spin, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.4, 0.5, 1] }}
        />
      ))}
    </div>
  );
}
