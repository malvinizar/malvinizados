"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};

/**
 * Renderiza en <body>, fuera del contenedor que se achica para entrar en pantalla.
 * Así las superposiciones (celebraciones, modales, confetti) siempre cubren toda la pantalla.
 */
export function Portal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? createPortal(children, document.body) : null;
}
