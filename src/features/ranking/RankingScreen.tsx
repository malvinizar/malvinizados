"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button3D } from "@/components/ui/Button3D";
import { CreamCard } from "@/components/ui/CreamCard";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { firebaseConfigured } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import { leerPerfil, obtenerRanking, type FilaRanking } from "./rankingService";

const MEDALLAS = [
  { bg: "from-gold-light to-gold", border: "border-gold-dark", text: "text-gold-ink" },
  { bg: "from-white to-[#c9d1dc]", border: "border-[#8a96a8]", text: "text-navy-900" },
  { bg: "from-[#f4c49a] to-[#d08a52]", border: "border-[#99582a]", text: "text-[#4a2610]" },
];

function Medalla({ puesto }: { puesto: number }) {
  const m = MEDALLAS[puesto - 1];
  if (!m) {
    return (
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-200 font-display text-lg text-ink-soft">
        {puesto}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full border-[3px] bg-linear-to-b font-display text-lg shadow-[0_3px_0_rgba(0,0,0,0.25)]",
        m.bg,
        m.border,
        m.text,
      )}
    >
      {puesto}
    </span>
  );
}

/** Tabla de posiciones: general o de una escuela. */
export function RankingScreen() {
  const params = useSearchParams();
  const [miEscuela, setMiEscuela] = useState<string>("");
  const [vista, setVista] = useState<"general" | "escuela">("general");
  const [filas, setFilas] = useState<FilaRanking[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const desdeUrl = params.get("escuela") ?? "";
    const escuela = desdeUrl || leerPerfil()?.escuela || "";
    setMiEscuela(escuela);
    if (desdeUrl) setVista("escuela");
  }, [params]);

  useEffect(() => {
    if (!firebaseConfigured()) return;
    let cancelado = false;
    setFilas(null);
    setError(false);
    obtenerRanking(vista === "escuela" && miEscuela ? { escuela: miEscuela } : {})
      .then((r) => {
        if (!cancelado) setFilas(r);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelado) setError(true);
      });
    return () => {
      cancelado = true;
    };
  }, [vista, miEscuela]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-8 px-4 pb-10 pt-14">
      <Logo compact />

      <motion.div
        className="w-full"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.2 }}
      >
        <CreamCard title="Ranking" titleTone="gold">
          {!firebaseConfigured() ? (
            <p className="mb-6 text-center font-bold text-ink-soft">El ranking todavía no está conectado.</p>
          ) : (
            <>
              {/* Pestañas */}
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-cream-200 p-1" role="tablist">
                {(["general", "escuela"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={vista === v}
                    disabled={v === "escuela" && !miEscuela}
                    onClick={() => setVista(v)}
                    className={cn(
                      "truncate rounded-xl px-2 py-2 font-display text-sm uppercase transition-colors disabled:opacity-40",
                      vista === v ? "bg-navy-700 text-white shadow-[0_3px_0_var(--color-navy-900)]" : "text-ink",
                    )}
                  >
                    {v === "general" ? "General" : miEscuela || "Mi escuela"}
                  </button>
                ))}
              </div>

              {error ? (
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
                <ol className="mb-6 flex flex-col gap-2">
                  <AnimatePresence>
                    {filas.map((f, i) => (
                      <motion.li
                        key={f.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border-[3px] px-3 py-2",
                          i < 3 ? "border-gold bg-white" : "border-cream-border bg-white/60",
                        )}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: Math.min(i, 12) * 0.04 }}
                      >
                        <Medalla puesto={i + 1} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-lg leading-tight text-navy-900">{f.nombre}</p>
                          <p className="truncate text-xs font-bold text-ink-soft">
                            {f.curso} · {f.escuela}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg leading-tight text-navy-800">{f.puntaje.toLocaleString("es-AR")}</p>
                          <p className="text-[11px] font-extrabold uppercase text-ink-soft">{f.malvinometro}% · {f.nivel}</p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ol>
              )}
            </>
          )}

          <div className="flex flex-col gap-4">
            <Button3D href="/jugar" size="lg" pulse>
              ¡Jugar!
            </Button3D>
            <Button3D href="/" variant="cream">
              Menú principal
            </Button3D>
          </div>
        </CreamCard>
      </motion.div>
    </main>
  );
}
