"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** A partir de este ancho (computadora / proyector) el contenido se achica para entrar sin scroll. */
const MIN_ANCHO = 1024;

/**
 * Mantiene el mismo diseño y lo achica proporcionalmente para que
 * entre completo en la altura de la pantalla (por ejemplo, 1920×1080).
 * En celulares no hace nada: se puede scrollear como siempre.
 */
export function FitToScreen({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;

    const update = () => {
      if (window.innerWidth < MIN_ANCHO) {
        setScale(1);
        return;
      }
      // offsetHeight no se ve afectado por el transform: es la altura real del diseño.
      const alto = el.offsetHeight;
      const next = alto > 0 ? Math.min(1, window.innerHeight / alto) : 1;
      setScale((prev) => (Math.abs(prev - next) < 0.005 ? prev : next));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const achicado = scale < 1;

  return (
    <div style={achicado ? { height: "100dvh", overflow: "clip" } : undefined}>
      <div
        ref={inner}
        style={
          achicado
            ? { transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.25s ease-out" }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
