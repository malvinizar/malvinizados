"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Proveedores globales del cliente. Respeta "reducir movimiento" del sistema. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
