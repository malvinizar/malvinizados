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

/** Pelota de fútbol. Fútbol. */
export function FutbolIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden {...props}>
      <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M32 21 L42 28.5 L38.5 40 H25.5 L22 28.5 Z" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M32 21 V9" />
        <path d="M42 28.5 L54 24" />
        <path d="M38.5 40 L46 51" />
        <path d="M25.5 40 L18 51" />
        <path d="M22 28.5 L10 24" />
      </g>
    </svg>
  );
}
