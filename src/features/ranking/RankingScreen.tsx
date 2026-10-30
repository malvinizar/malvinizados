"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button3D } from "@/components/ui/Button3D";
import { CreamCard } from "@/components/ui/CreamCard";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { firebaseConfigured, uidActual } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import { agruparInstituciones, leerPerfil, normalizar, obtenerRankingCompleto, type FilaRanking } from "./rankingService";

/** Puestos que quedan fijos arriba, siempre visibles. */
const PODIO = 3;
/** Filas que se ven debajo del podio al entrar y cuántas se suman con cada "Ver más". */
const INICIALES = 7;
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

interface FilaProps {
  fila: FilaRanking;
  puesto: number;
  /** Es un puntaje de quien está mirando. */
  propia?: boolean;
  delay?: number;
  className?: string;
}

function Fila({ fila, puesto, propia, delay = 0, className }: FilaProps) {
  const subtitulo = [fila.curso, fila.escuela].filter(Boolean).join(" · ");
  return (
    <motion.li
      className={cn(
        "flex items-center gap-3 rounded-2xl border-[3px] px-3 py-2",
        propia
          ? "border-celeste-dark bg-celeste-light"
          : puesto <= PODIO
            ? "border-gold bg-white"
            : "border-cream-border bg-white/60",
        className,
      )}
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Medalla puesto={puesto} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight text-navy-900">{fila.nombre}</p>
        <p className="truncate text-xs font-bold text-ink-soft" title={subtitulo}>
          {subtitulo}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-lg leading-tight text-navy-800">{fila.puntaje.toLocaleString("es-AR")}</p>
        <p className="text-[11px] font-extrabold uppercase text-ink-soft">
          {fila.malvinometro}% · {fila.nivel}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * Ranking general.
 * - El podio (1° a 3°) queda fijo arriba.
 * - El resto se desplaza dentro de la tarjeta y se carga de a bloques con "Ver más",
 *   así la tarjeta no crece ni se achica al sumar personas.
 * - La mejor posición de quien mira queda anclada abajo.
 * - Se puede filtrar por institución (también con el link ?escuela=...).
 */
export function RankingScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const escuela = searchParams.get("escuela") ?? "";

  const [todas, setTodas] = useState<FilaRanking[] | null>(null);
  const [error, setError] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [visibles, setVisibles] = useState(INICIALES);
  const listaRef = useRef<HTMLOListElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const primeraNueva = useRef<number | null>(null);

  useEffect(() => {
    if (!firebaseConfigured()) return;
    let cancelado = false;
    obtenerRankingCompleto()
      .then((r) => {
        if (!cancelado) setTodas(r);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelado) setError(true);
      });
    uidActual()
      .then((u) => {
        if (!cancelado) setUid(u);
      })
      .catch(() => {
        /* sin sesión: se usa el perfil guardado */
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const instituciones = useMemo(() => (todas ? agruparInstituciones(todas) : []), [todas]);

  const filas = useMemo(() => {
    if (!todas) return null;
    if (!escuela) return todas;
    return todas.filter((f) => normalizar(f.escuela) === escuela);
  }, [todas, escuela]);

  /** Reconoce los puntajes propios por la sesión del dispositivo o, si no hay, por el perfil guardado. */
  const esPropia = useMemo(() => {
    const perfil = typeof window !== "undefined" ? leerPerfil() : null;
    const nombre = perfil ? normalizar(perfil.nombre) : "";
    const esc = perfil ? normalizar(perfil.escuela) : "";
    return (f: FilaRanking) =>
      (uid !== null && f.uid === uid) || (!!nombre && normalizar(f.nombre) === nombre && normalizar(f.escuela) === esc);
  }, [uid]);

  const miIndice = filas ? filas.findIndex(esPropia) : -1;
  const tengoPuntajes = !!todas && todas.some(esPropia);

  // Al cambiar de institución, volver al principio.
  useEffect(() => {
    setVisibles(INICIALES);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [escuela]);

  // Al tocar "Ver más", llevar la vista a los nuevos participantes (solo dentro de la lista).
  useEffect(() => {
    const i = primeraNueva.current;
    const cont = scrollRef.current;
    const item = i !== null ? (listaRef.current?.children[i] as HTMLElement | undefined) : undefined;
    if (cont && item) cont.scrollTo({ top: item.offsetTop - cont.offsetTop - 4, behavior: "smooth" });
    primeraNueva.current = null;
  }, [visibles]);

  function cambiarEscuela(clave: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (clave) params.set("escuela", clave);
    else params.delete("escuela");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function verMas() {
    primeraNueva.current = visibles;
    setVisibles((v) => v + POR_PAGINA);
  }

  const podio = filas?.slice(0, PODIO) ?? [];
  const resto = filas?.slice(PODIO) ?? [];
  const restoVisible = resto.slice(0, visibles);
  const hayMas = resto.length > visibles;
  const institucionActual = instituciones.find((i) => i.clave === escuela);

  // En computadora (desde 1024 px, donde FitToScreen achica la página) la pantalla ocupa
  // exactamente el alto de la ventana y solo la lista se desplaza: así el tamaño no depende
  // de cuántas personas haya. En celular la página scrollea normal y la lista tiene un tope.
  return (
    <main className="mx-auto flex min-h-dvh w-full lg:h-dvh lg:min-h-[55rem] max-w-md flex-col items-center gap-5 px-4 pb-6 pt-8">
      <Logo compact />

      <motion.div
        className="flex min-h-0 w-full flex-1 flex-col"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.2 }}
      >
        <CreamCard
          title="Ranking general"
          titleTone="gold"
          className="flex min-h-0 flex-1 flex-col"
          bodyClassName="flex min-h-0 flex-1 flex-col"
        >
          {!firebaseConfigured() ? (
            <p className="mb-6 text-center font-bold text-ink-soft">El ranking todavía no está conectado.</p>
          ) : error ? (
            <p className="mb-6 rounded-xl bg-cine/15 px-3 py-3 text-center text-sm font-bold text-cine-dark">
              No se pudo cargar el ranking. Probá de nuevo en un rato.
            </p>
          ) : filas === null ? (
            <div className="mb-6 flex flex-1 items-center justify-center py-8" aria-label="Cargando">
              <motion.div className="size-16" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <SolDeMayo className="size-full" withFace={false} />
              </motion.div>
            </div>
          ) : todas && todas.length === 0 ? (
            <p className="mb-6 py-6 text-center font-bold text-ink-soft">Todavía no hay puntajes. ¡Sé la primera persona!</p>
          ) : (
            <div className="mb-4 flex min-h-0 flex-1 flex-col gap-3">
              {/* Filtro por institución */}
              {instituciones.length > 1 ? (
                <label className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-extrabold uppercase text-ink-soft">Institución</span>
                  <select
                    value={institucionActual ? escuela : ""}
                    onChange={(e) => cambiarEscuela(e.target.value)}
                    className="min-w-0 flex-1 cursor-pointer truncate rounded-xl border-[3px] border-cream-border bg-white px-3 py-1.5 text-sm font-bold text-ink focus:border-celeste-dark focus:outline-none"
                  >
                    <option value="">Todas ({todas?.length ?? 0})</option>
                    {instituciones.map((i) => (
                      <option key={i.clave} value={i.clave}>
                        {i.nombre} ({i.cantidad})
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {/* Podio fijo */}
              <ol className="flex shrink-0 flex-col gap-2" aria-label="Podio">
                {podio.map((f, i) => (
                  <Fila key={f.id} fila={f} puesto={i + 1} propia={esPropia(f)} delay={i * 0.04} />
                ))}
              </ol>

              {/* Resto: se desplaza dentro de la tarjeta */}
              {resto.length > 0 ? (
                <div
                  ref={scrollRef}
                  className="ranking-scroll -mx-1 min-h-[8.5rem] flex-1 overflow-y-auto max-lg:max-h-[50dvh] overscroll-contain px-1 pb-1"
                >
                  <ol ref={listaRef} className="flex flex-col gap-2" start={PODIO + 1}>
                    {restoVisible.map((f, i) => (
                      <Fila
                        key={f.id}
                        fila={f}
                        puesto={PODIO + i + 1}
                        propia={esPropia(f)}
                        delay={(i % POR_PAGINA) * 0.04}
                      />
                    ))}
                  </ol>
                  {hayMas ? (
                    <div className="mt-3 flex justify-center">
                      <button
                        type="button"
                        onClick={verMas}
                        className="rounded-full border-[3px] border-navy-700 bg-white px-6 py-2 font-display text-base uppercase text-navy-700 shadow-[0_3px_0_var(--color-navy-700)] transition-transform active:translate-y-0.5"
                      >
                        Ver más
                      </button>
                    </div>
                  ) : (
                    <p className="mt-3 text-center text-xs font-extrabold uppercase text-ink-soft">
                      {filas.length} {filas.length === 1 ? "participante" : "participantes"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Mi posición, anclada abajo */}
              <div className="shrink-0 border-t-[3px] border-dashed border-cream-border pt-3">
                <p className="mb-1.5 text-xs font-extrabold uppercase text-ink-soft">
                  {escuela ? "Tu posición en esta institución" : "Tu posición"}
                </p>
                {miIndice >= 0 && filas ? (
                  <ol>
                    <Fila fila={filas[miIndice]} puesto={miIndice + 1} propia />
                  </ol>
                ) : (
                  <p className="rounded-2xl border-[3px] border-dashed border-cream-border bg-white/50 px-3 py-2.5 text-center text-sm font-bold text-ink-soft">
                    {tengoPuntajes
                      ? "Todavía no tenés puntajes en esta institución."
                      : "Jugá y guardá tu puntaje para aparecer acá."}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex shrink-0 flex-col gap-4">
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
