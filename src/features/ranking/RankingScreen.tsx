"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button3D } from "@/components/ui/Button3D";
import { CreamCard } from "@/components/ui/CreamCard";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { firebaseConfigured } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import { obtenerRanking, type FilaRanking } from "./rankingService";

/** Cuántos se ven al entrar y cuántos se suman con cada "Ver más". */
const INICIALES = 5;
const POR_PAGINA = 10;

const MEDALLAS = [
  { bg: "from-gold-light to-gold", border: "border-gold-dark", text: "text-gold-ink" },
  { bg: "from-white to-[#c9d1dc]", border: "border-[#8a96a8]", text: "text-navy-900" },
  { bg: "from-[#f4c49a] to-[#d08a52]", border: "border-[#99582a]", text: "text-[#4a2610]" },
];

function Medalla({ puesto }: { puesto: number }) {
  const m = MEDALLAS[puesto - 1];
  if (!m) {
    return (
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-200 font-display text-lg text-ink-soft lg:size-12 lg:text-xl">
        {puesto}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full border-[3px] bg-linear-to-b font-display text-lg shadow-[0_3px_0_rgba(0,0,0,0.25)] lg:size-12 lg:text-xl",
        m.bg,
        m.border,
        m.text,
      )}
    >
      {puesto}
    </span>
  );
}

/** Ranking general: muestra los 5 mejores y permite ver más. */
export function RankingScreen() {
  const [cantidad, setCantidad] = useState(INICIALES);
  const [filas, setFilas] = useState<FilaRanking[] | null>(null);
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const listaRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!firebaseConfigured()) return;
    let cancelado = false;
    setCargando(true);
    setError(false);
    obtenerRanking(cantidad)
      .then((r) => {
        if (cancelado) return;
        setFilas(r.filas);
        setHayMas(r.hayMas);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelado) setError(true);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [cantidad]);

  // Al cargar más, llevar la vista a los nuevos participantes.
  useEffect(() => {
    if (cantidad > INICIALES && filas && listaRef.current) {
      const item = listaRef.current.children[cantidad - POR_PAGINA] as HTMLElement | undefined;
      item?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [filas, cantidad]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-8 px-4 pb-10 pt-14 lg:h-dvh lg:max-w-3xl lg:justify-center lg:gap-10 lg:py-10">
      <Logo compact className="lg:scale-125" />

      <motion.div
        className="w-full"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.2 }}
      >
        <CreamCard title="Ranking general" titleTone="gold" bodyClassName="lg:px-10 lg:pb-8">
          {!firebaseConfigured() ? (
            <p className="mb-6 text-center font-bold text-ink-soft">El ranking todavía no está conectado.</p>
          ) : error ? (
            <p className="mb-6 rounded-xl bg-cine/15 px-3 py-3 text-center text-sm font-bold text-cine-dark">
              No se pudo cargar el ranking. Probá de nuevo en un rato.
            </p>
          ) : filas === null ? (
            <div className="mb-6 flex justify-center py-8" aria-label="Cargando">
              <motion.div className="size-16" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <SolDeMayo className="size-full" withFace={false} />
              </motion.div>
            </div>
          ) : filas.length === 0 ? (
            <p className="mb-6 py-6 text-center font-bold text-ink-soft">Todavía no hay puntajes. ¡Sé la primera persona!</p>
          ) : (
            <>
              <ol ref={listaRef} className="mb-4 flex flex-col gap-2 lg:max-h-[50vh] lg:overflow-y-auto lg:pr-2">
                {filas.map((f, i) => (
                  <motion.li
                    key={f.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-[3px] px-3 py-2 lg:gap-4 lg:px-4 lg:py-3",
                      i < 3 ? "border-gold bg-white" : "border-cream-border bg-white/60",
                    )}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (i % POR_PAGINA) * 0.04 }}
                  >
                    <Medalla puesto={i + 1} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg leading-tight text-navy-900 lg:text-2xl">{f.nombre}</p>
                      <p className="truncate text-xs font-bold text-ink-soft lg:text-sm">
                        {f.curso} · {f.escuela}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg leading-tight text-navy-800 lg:text-2xl">{f.puntaje.toLocaleString("es-AR")}</p>
                      <p className="text-[11px] font-extrabold uppercase text-ink-soft lg:text-xs">
                        {f.malvinometro}% · {f.nivel}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              {hayMas ? (
                <div className="mb-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => c + POR_PAGINA)}
                    disabled={cargando}
                    className="rounded-full border-[3px] border-navy-700 bg-white px-6 py-2 font-display text-base uppercase text-navy-700 shadow-[0_3px_0_var(--color-navy-700)] transition-transform active:translate-y-0.5 disabled:opacity-50"
                  >
                    {cargando ? "Cargando…" : "Ver más"}
                  </button>
                </div>
              ) : (
                <div className="mb-2" />
              )}
            </>
          )}

          <div className="flex flex-col gap-4 lg:flex-row">
            <Button3D href="/jugar" size="lg" pulse>
              ¡Jugar!
            </Button3D>
            <Button3D href="/" variant="cream" size="lg">
              Menú principal
            </Button3D>
          </div>
        </CreamCard>
      </motion.div>
    </main>
  );
}
