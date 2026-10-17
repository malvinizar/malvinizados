"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Button3D } from "@/components/ui/Button3D";
import { firebaseConfigured } from "@/lib/firebase";
import { sound } from "@/lib/sound";
import { guardarPerfil, guardarPuntaje, leerPerfil, limpiar, LIMITES, type NuevoPuntaje } from "./rankingService";

type Datos = Omit<NuevoPuntaje, "nombre" | "curso" | "escuela">;

const input =
  "w-full rounded-xl border-[3px] border-cream-border bg-white px-3 py-2.5 text-base font-bold text-ink placeholder:font-semibold placeholder:text-ink-soft/60 focus:border-celeste-dark focus:outline-none";

/** Formulario de la pantalla final para guardar el puntaje en el ranking. */
export function SaveScoreForm({ datos }: { datos: Datos }) {
  const [nombre, setNombre] = useState("");
  const [curso, setCurso] = useState("");
  const [escuela, setEscuela] = useState("");
  const [estado, setEstado] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Completa con lo que se usó la última vez en este dispositivo.
  useEffect(() => {
    const p = leerPerfil();
    if (p) {
      setNombre(p.nombre);
      setCurso(p.curso);
      setEscuela(p.escuela);
    }
  }, []);

  if (!firebaseConfigured()) {
    return (
      <p className="rounded-xl bg-cream-200 px-3 py-2 text-center text-sm font-bold text-ink-soft">
        El ranking todavía no está conectado.
      </p>
    );
  }

  const valido = limpiar(nombre, LIMITES.nombre).length >= 2 && limpiar(curso, LIMITES.curso) && limpiar(escuela, LIMITES.escuela).length >= 3;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valido || estado === "saving" || estado === "saved") return;
    setEstado("saving");
    try {
      await guardarPuntaje({ ...datos, nombre, curso, escuela });
      guardarPerfil({ nombre: limpiar(nombre, LIMITES.nombre), curso: limpiar(curso, LIMITES.curso), escuela: limpiar(escuela, LIMITES.escuela) });
      setEstado("saved");
      sound.play("streak");
    } catch (err) {
      console.error(err);
      setEstado("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {estado === "saved" ? (
        <motion.div
          key="ok"
          className="flex flex-col gap-3 rounded-2xl border-[3px] border-futbol-dark bg-futbol/15 p-4 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="font-display text-xl text-futbol-dark">¡Puntaje guardado!</p>
          <Button3D variant="celeste" href="/ranking">
            Ver ranking
          </Button3D>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-center font-display text-lg uppercase text-navy-800">Guardá tu puntaje</p>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase text-ink-soft">Nombre o apodo</span>
            <input className={input} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={LIMITES.nombre} placeholder="Ej.: Cande" autoComplete="nickname" required />
          </label>
          <div className="grid grid-cols-[6.5rem_1fr] gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-extrabold uppercase text-ink-soft">Curso</span>
              <input className={input} value={curso} onChange={(e) => setCurso(e.target.value)} maxLength={LIMITES.curso} placeholder="4° B" required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-extrabold uppercase text-ink-soft">Escuela</span>
              <input className={input} value={escuela} onChange={(e) => setEscuela(e.target.value)} maxLength={LIMITES.escuela} placeholder="Nombre de tu escuela" required />
            </label>
          </div>
          <p className="text-xs font-semibold text-ink-soft">
            El ranking es público: usá tu nombre de pila o un apodo, nunca tu nombre completo.
          </p>
          {estado === "error" ? (
            <p className="rounded-lg bg-cine/15 px-3 py-2 text-sm font-bold text-cine-dark">
              No se pudo guardar. Revisá tu conexión e intentá de nuevo.
            </p>
          ) : null}
          <Button3D type="submit" variant="green" disabled={!valido || estado === "saving"}>
            {estado === "saving" ? "Guardando…" : "Guardar en el ranking"}
          </Button3D>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
