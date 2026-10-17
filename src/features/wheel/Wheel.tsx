"use client";

import { motion, type MotionValue } from "framer-motion";
import { CATEGORIES } from "@/config/categories";
import { SolDeMayo } from "@/components/ui/SolDeMayo";
import { cn } from "@/lib/cn";
import { SECTORS, SECTOR_ANGLE, sectorCenter } from "./sectors";

interface WheelProps {
  rotation: MotionValue<number>;
  pointer: MotionValue<number>;
  spinning: boolean;
  /** Sector ganador a resaltar (cuando la ruleta frenó). */
  highlight: number | null;
  /** Toque en el Sol central: gira. */
  onSpin: () => void;
  disabled?: boolean;
  className?: string;
}

const R_WHEEL = 178; // radio de los sectores
const R_ICON = 116; // radio donde van los íconos
const BULBS = 18;

function polar(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [r * Math.sin(rad), -r * Math.cos(rad)];
}

function sectorPath(index: number, r = R_WHEEL): string {
  const a0 = index * SECTOR_ANGLE;
  const a1 = a0 + SECTOR_ANGLE;
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  return `M0 0 L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

/**
 * Ruleta principal del juego. Dibujada en SVG; gira con la rotación recibida.
 */
export function Wheel({ rotation, pointer, spinning, highlight, onSpin, disabled, className }: WheelProps) {
  return (
    <div className={cn("relative mx-auto aspect-square w-[min(88vw,26rem)] select-none", className)}>
      {/* Sombra del piso */}
      <div className="absolute inset-x-[8%] -bottom-3 h-8 rounded-[50%] bg-navy-950/60 blur-md" aria-hidden />

      {/* Aro fijo con luces */}
      <svg viewBox="-210 -210 420 420" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe07a" />
            <stop offset="50%" stopColor="#f5b921" />
            <stop offset="100%" stopColor="#b97206" />
          </linearGradient>
        </defs>
        <circle r={206} fill="#7a4a05" />
        <circle r={202} fill="url(#rim)" />
        <circle r={184} fill="#7a4a05" />
        {Array.from({ length: BULBS }, (_, i) => {
          const [x, y] = polar(193, (i * 360) / BULBS);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={5.5}
              className={cn("wheel-bulb", spinning && "wheel-bulb-fast")}
              style={{ animationDelay: `${(i % 2) * (spinning ? 0.12 : 0.6)}s` }}
            />
          );
        })}
      </svg>

      {/* Disco que gira */}
      <motion.div className="absolute inset-0" style={{ rotate: rotation }}>
        <svg viewBox="-210 -210 420 420" className="size-full" role="img" aria-label="Ruleta de categorías">
          <defs>
            {CATEGORIES.map((c) => (
              <radialGradient key={c.slug} id={`sec-${c.slug}`} cx="0" cy="0" r={R_WHEEL} gradientUnits="userSpaceOnUse">
                <stop offset="15%" stopColor={c.colorLight} />
                <stop offset="65%" stopColor={c.color} />
                <stop offset="100%" stopColor={c.colorDark} />
              </radialGradient>
            ))}
            <radialGradient id="sec-comodin" cx="0" cy="0" r={R_WHEEL} gradientUnits="userSpaceOnUse">
              <stop offset="15%" stopColor="#fff4cc" />
              <stop offset="65%" stopColor="#f5b921" />
              <stop offset="100%" stopColor="#c47f08" />
            </radialGradient>
          </defs>

          {SECTORS.map((sector, i) => (
            <path
              key={i}
              d={sectorPath(i)}
              fill={sector.kind === "comodin" ? "url(#sec-comodin)" : `url(#sec-${sector.category.slug})`}
              stroke="#fbf0d9"
              strokeWidth={4}
              strokeLinejoin="round"
            />
          ))}

          {/* Contenido de cada sector (ícono orientado hacia afuera) */}
          {SECTORS.map((sector, i) => {
            const angle = sectorCenter(i);
            return (
              <g key={`c-${i}`} transform={`rotate(${angle}) translate(0 ${-R_ICON})`}>
                {sector.kind === "comodin" ? (
                  <SolDeMayo x={-34} y={-34} width={68} height={68} withFace={false} />
                ) : (
                  <g style={{ filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.25))" }}>
                    <sector.category.Icon x={-27} y={-27} width={54} height={54} color="#ffffff" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Brillo del sector ganador */}
          {highlight !== null ? (
            <motion.path
              d={sectorPath(highlight)}
              fill="#ffffff"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.15, 0.45, 0.2] }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
          ) : null}

          {/* Anillo interior */}
          <circle r={60} fill="#7a4a05" />
        </svg>
      </motion.div>

      {/* Sol central: botón para girar */}
      <motion.button
        type="button"
        onClick={onSpin}
        disabled={disabled || spinning}
        aria-label="Girar la ruleta"
        className="absolute left-1/2 top-1/2 grid size-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-default"
        whileHover={disabled || spinning ? undefined : { scale: 1.06 }}
        whileTap={disabled || spinning ? undefined : { scale: 0.92 }}
        animate={spinning || disabled ? { scale: 1 } : { scale: [1, 1.05, 1] }}
        transition={spinning || disabled ? { duration: 0.2 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <SolDeMayo className="absolute inset-[-14%] size-[128%] drop-shadow-[0_6px_0_rgba(90,50,0,0.6)]" />
        <span className="text-game relative mt-[2%] text-[clamp(0.85rem,4vw,1.2rem)] leading-none text-white [--stroke-w:4px] [--drop:2px]">
          {spinning ? "" : "GIRAR"}
        </span>
      </motion.button>

      {/* Aguja */}
      <motion.div
        className="absolute left-1/2 top-[-4%] z-10 w-[13%] -translate-x-1/2"
        style={{ rotate: pointer, transformOrigin: "50% 18%" }}
        aria-hidden
      >
        <svg viewBox="0 0 60 80" className="w-full drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
          <defs>
            <linearGradient id="pin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffe07a" />
              <stop offset="100%" stopColor="#c47f08" />
            </linearGradient>
          </defs>
          <path d="M30 78 L6 22 A26 26 0 1 1 54 22 Z" fill="url(#pin)" stroke="#7a4a05" strokeWidth={4} strokeLinejoin="round" />
          <circle cx={30} cy={20} r={10} fill="#e8483b" stroke="#7a4a05" strokeWidth={3} />
          <circle cx={27} cy={17} r={3} fill="#ffffff" opacity={0.8} />
        </svg>
      </motion.div>
    </div>
  );
}
