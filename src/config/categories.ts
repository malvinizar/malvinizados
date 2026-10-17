import type { ComponentType, SVGProps } from "react";
import { CineIcon, FutbolIcon, LibroIcon, MusicaIcon } from "@/components/icons/CategoryIcons";

/** Valores exactos que usa el campo "categoria" del JSON de preguntas. */
export type CategoriaId = "Historia" | "Música" | "Cine" | "Fútbol";

export interface CategoryDef {
  id: CategoriaId;
  /** Para rutas y claves (sin tildes). */
  slug: "historia" | "musica" | "cine" | "futbol";
  label: string;
  /** Color principal, oscuro (canto/borde) y claro (brillo). */
  color: string;
  colorDark: string;
  colorLight: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    id: "Historia",
    slug: "historia",
    label: "Historia",
    color: "#3fa9f5",
    colorDark: "#1f74b8",
    colorLight: "#a9dcff",
    Icon: LibroIcon,
  },
  {
    id: "Música",
    slug: "musica",
    label: "Música",
    color: "#8e5bd9",
    colorDark: "#5e339f",
    colorLight: "#cdb2f5",
    Icon: MusicaIcon,
  },
  {
    id: "Cine",
    slug: "cine",
    label: "Cine",
    color: "#e8483b",
    colorDark: "#a92b21",
    colorLight: "#ffb0a8",
    Icon: CineIcon,
  },
  {
    id: "Fútbol",
    slug: "futbol",
    label: "Fútbol",
    color: "#2db34a",
    colorDark: "#1d7a31",
    colorLight: "#a3eab0",
    Icon: FutbolIcon,
  },
] as const;

export const CATEGORY_BY_ID: Record<CategoriaId, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoriaId, CategoryDef>;
