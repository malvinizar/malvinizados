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
  /** Sesión anónima que guardó el puntaje (sirve para reconocer al jugador). */
  uid: string;
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

/**
 * Tope de seguridad de filas que se traen por visita.
 * Cada fila es una lectura de Firestore, así que conviene no subirlo de más.
 */
export const MAX_FILAS = 1000;

/**
 * Ranking completo ordenado de mayor a menor puntaje.
 * Se trae entero (hasta MAX_FILAS) para poder filtrar por institución
 * y encontrar la posición del jugador sin pedir más datos.
 */
export async function obtenerRankingCompleto(): Promise<FilaRanking[]> {
  const q = query(collection(db(), RANKING_COLLECTION), orderBy("puntaje", "desc"), limit(MAX_FILAS));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      uid: String(x.uid ?? ""),
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
}

/**
 * Clave para comparar textos escritos a mano: sin tildes, sin mayúsculas,
 * sin signos y con espacios simples. "UNPilar." y "unpilar" dan lo mismo.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface Institucion {
  /** Clave normalizada (la que va en la URL: ?escuela=). */
  clave: string;
  /** Cómo se muestra: la forma más usada por quienes la escribieron. */
  nombre: string;
  /** Cantidad de puntajes guardados. */
  cantidad: number;
}

/** Instituciones presentes en el ranking, de la que más puntajes tiene a la que menos. */
export function agruparInstituciones(filas: FilaRanking[]): Institucion[] {
  const grupos = new Map<string, { formas: Map<string, number>; cantidad: number }>();
  for (const f of filas) {
    const clave = normalizar(f.escuela);
    if (!clave) continue;
    const g = grupos.get(clave) ?? { formas: new Map(), cantidad: 0 };
    const forma = f.escuela.trim().replace(/\s+/g, " ");
    g.formas.set(forma, (g.formas.get(forma) ?? 0) + 1);
    g.cantidad += 1;
    grupos.set(clave, g);
  }
  return [...grupos.entries()]
    .map(([clave, g]) => ({
      clave,
      nombre: [...g.formas.entries()].sort((a, b) => b[1] - a[1])[0][0],
      cantidad: g.cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, "es"));
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
