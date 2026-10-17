"use client";

import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { RANKING_COLLECTION } from "@/config/firebase";
import { db, ensureAnonymousUser } from "@/lib/firebase";

export const LIMITES = {
  nombre: 24,
  curso: 12,
  escuela: 60,
} as const;

export interface NuevoPuntaje {
  nombre: string;
  curso: string;
  escuela: string;
  puntaje: number;
  malvinometro: number;
  nivel: string;
  aciertos: number;
  total: number;
  duracionSeg: number;
}

export interface FilaRanking extends NuevoPuntaje {
  id: string;
  fecha: Date | null;
}

/** Limpia espacios repetidos y recorta al largo máximo. */
export function limpiar(texto: string, max: number): string {
  return texto.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function guardarPuntaje(data: NuevoPuntaje): Promise<string> {
  const user = await ensureAnonymousUser();
  const ref = await addDoc(collection(db(), RANKING_COLLECTION), {
    nombre: limpiar(data.nombre, LIMITES.nombre),
    curso: limpiar(data.curso, LIMITES.curso),
    escuela: limpiar(data.escuela, LIMITES.escuela),
    puntaje: Math.round(data.puntaje),
    malvinometro: Math.round(data.malvinometro),
    nivel: data.nivel,
    aciertos: data.aciertos,
    total: data.total,
    duracionSeg: Math.round(data.duracionSeg),
    uid: user.uid,
    fecha: serverTimestamp(),
  });
  return ref.id;
}

/** Mejores puntajes. Si se indica escuela, filtra por esa escuela. */
export async function obtenerRanking(opciones: { escuela?: string; cantidad?: number } = {}): Promise<FilaRanking[]> {
  const cantidad = opciones.cantidad ?? 20;
  const base = collection(db(), RANKING_COLLECTION);
  // Por escuela se ordena en el navegador: así no hace falta crear un índice compuesto en Firestore.
  const q = opciones.escuela
    ? query(base, where("escuela", "==", opciones.escuela), limit(300))
    : query(base, orderBy("puntaje", "desc"), limit(cantidad));
  const snap = await getDocs(q);
  const filas = snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      nombre: String(x.nombre ?? ""),
      curso: String(x.curso ?? ""),
      escuela: String(x.escuela ?? ""),
      puntaje: Number(x.puntaje ?? 0),
      malvinometro: Number(x.malvinometro ?? 0),
      nivel: String(x.nivel ?? ""),
      aciertos: Number(x.aciertos ?? 0),
      total: Number(x.total ?? 0),
      duracionSeg: Number(x.duracionSeg ?? 0),
      fecha: x.fecha instanceof Timestamp ? x.fecha.toDate() : null,
    };
  });
  return filas.sort((a, b) => b.puntaje - a.puntaje).slice(0, cantidad);
}

/* Datos del jugador recordados en este dispositivo (para no tipearlos cada vez). */
const PERFIL_KEY = "malvinizar:perfil";

export interface PerfilJugador {
  nombre: string;
  curso: string;
  escuela: string;
}

export function leerPerfil(): PerfilJugador | null {
  try {
    const raw = window.localStorage.getItem(PERFIL_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<PerfilJugador>;
    return { nombre: p.nombre ?? "", curso: p.curso ?? "", escuela: p.escuela ?? "" };
  } catch {
    return null;
  }
}

export function guardarPerfil(p: PerfilJugador): void {
  try {
    window.localStorage.setItem(PERFIL_KEY, JSON.stringify(p));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}
