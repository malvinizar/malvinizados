"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

/** Número que cuenta hasta su nuevo valor. */
export function AnimatedNumber({ value, duration = 0.8, className }: AnimatedNumberProps) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("es-AR"));

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, value, duration]);

  return <motion.span className={className}>{text}</motion.span>;
}
