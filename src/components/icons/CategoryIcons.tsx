/**
 * Íconos propios de cada categoría. Dibujados desde cero, en un solo color
 * (currentColor) para poder teñirlos según el contexto.
 */

import type { SVGProps } from "react";

/** Acepta cualquier atributo SVG (className, width, height, x, y…) para poder usarlos dentro de otros SVG. */
type IconProps = SVGProps<SVGSVGElement>;

/** Silueta estilizada de las islas (Gran Malvina y Soledad). Historia. */
export function IslasIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 100 64" fill="currentColor" aria-hidden {...props}>
      {/* Gran Malvina */}
      <path d="M18 12 Q26 8 32 14 Q38 20 36 26 Q42 30 38 36 Q36 46 28 50 Q20 54 18 46 Q16 40 20 34 Q12 30 14 22 Q12 16 18 12 Z" />
      {/* Soledad: norte, istmo y sur */}
      <path d="M52 14 Q62 6 74 10 Q84 8 92 16 Q98 22 92 28 Q86 32 78 30 Q72 32 68 36 Q72 40 70 46 Q64 56 54 52 Q46 48 50 42 Q56 38 60 34 Q54 30 50 24 Q48 18 52 14 Z" />
      {/* Islotes */}
      <circle cx="42" cy="12" r="2.4" />
      <circle cx="44" cy="46" r="2" />
      <circle cx="9" cy="40" r="1.8" />
    </svg>
  );
}

/** Libro abierto. Historia. */
export function LibroIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden {...props}>
      {/* Páginas con renglones calados */}
      <path
        fillRule="evenodd"
        d="M30.5 15 C23 9.5 12 9.5 5 12.5 V51 C12 48 23 48 30.5 53.5 Z M10 21 h15 v2.8 h-15 z M10 28 h15 v2.8 h-15 z M10 35 h15 v2.8 h-15 z M10 42 h10 v2.8 h-10 z"
      />
      <path
        fillRule="evenodd"
        d="M33.5 15 C41 9.5 52 9.5 59 12.5 V51 C52 48 41 48 33.5 53.5 Z M39 21 h15 v2.8 h-15 z M39 28 h15 v2.8 h-15 z M39 35 h15 v2.8 h-15 z M39 42 h10 v2.8 h-10 z"
      />
      {/* Tapa */}
      <path d="M3 54 C14 50.5 24 51.5 32 56.5 C40 51.5 50 50.5 61 54 V57.5 C50 54.5 40 55.5 32 60.5 C24 55.5 14 54.5 3 57.5 Z" />
    </svg>
  );
}

/** Nota musical doble. Música. */
export function MusicaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden {...props}>
      <path d="M24 12 L54 5 V44 H48 V17 L30 21 V50 H24 Z" />
      <ellipse cx="18" cy="50" rx="10" ry="8" transform="rotate(-18 18 50)" />
      <ellipse cx="42" cy="44" rx="10" ry="8" transform="rotate(-18 42 44)" />
    </svg>
  );
}

/** Claqueta de cine. Cine. */
export function CineIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden {...props}>
      {/* Tabla superior inclinada */}
      <path
        fillRule="evenodd"
        d="M6 20 L54 8 L57 18 L9 30 Z M17 24.5 L23 16 L28 15 L22 23.5 Z M30 21.5 L36 13 L41 12 L35 20.5 Z M43 18.5 L49 10 L53 9.5 L48 17.5 Z"
      />
      {/* Cuerpo */}
      <path fillRule="evenodd" d="M8 32 H58 V56 Q58 58 56 58 H10 Q8 58 8 56 Z M14 38 V52 H52 V38 Z" />
      <rect x="18" y="42" width="22" height="3.5" rx="1.75" />
      <rect x="18" y="47" width="14" height="3.5" rx="1.75" />
    </svg>
  );
}

/** Camiseta con el número 10. Fútbol. */
export function FutbolIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden {...props}>
      {/* Camiseta con el "10" calado */}
      <path
        fillRule="evenodd"
        d="M22 6 Q32 14 42 6 L55 10.5 L63 24 L52.5 30 L50 26.5 V56 Q50 58 48 58 H16 Q14 58 14 56 V26.5 L11.5 30 L1 24 L9 10.5 Z M20.5 28 H27 V50 H21.5 V34 L17.5 36 V31 Z M38.5 28 a7.5 7.5 0 0 1 7.5 7.5 v7 a7.5 7.5 0 0 1 -15 0 v-7 a7.5 7.5 0 0 1 7.5 -7.5 Z M38.5 33 a2.5 2.5 0 0 1 2.5 2.5 v7 a2.5 2.5 0 0 1 -5 0 v-7 a2.5 2.5 0 0 1 2.5 -2.5 Z"
      />
    </svg>
  );
}
