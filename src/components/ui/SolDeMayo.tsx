import { useId, type SVGProps } from "react";
import { cn } from "@/lib/cn";

interface SolDeMayoProps extends Omit<SVGProps<SVGSVGElement>, "viewBox"> {
  className?: string;
  /** Dibuja el rostro del sol. */
  withFace?: boolean;
}

const RAY_COUNT = 32;
const STRAIGHT_RAY = "M-3.4,-25 L0,-58 L3.4,-25 Z";
const WAVY_RAY =
  "M-2.6,-25 Q-6.2,-31 -1.8,-37 Q3.2,-43 -0.9,-51 L0.9,-51 Q5.6,-43 1.6,-37 Q-2.4,-31 2.6,-25 Z";

/**
 * Sol de Mayo dibujado desde cero: 32 rayos que alternan rectos y flamígeros.
 */
export function SolDeMayo({ className, withFace = true, ...rest }: SolDeMayoProps) {
  const id = useId().replace(/:/g, "");
  const gradId = `sol-grad-${id}`;
  const faceId = `sol-face-${id}`;

  return (
    <svg viewBox="-60 -60 120 120" className={cn("block", className)} aria-hidden {...rest}>
      <defs>
        <radialGradient id={gradId} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffe9a0" />
          <stop offset="55%" stopColor="#f5b921" />
          <stop offset="100%" stopColor="#d48c0c" />
        </radialGradient>
        <radialGradient id={faceId} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff1b8" />
          <stop offset="100%" stopColor="#f2b01c" />
        </radialGradient>
      </defs>

      <g fill={`url(#${gradId})`} stroke="#b06e05" strokeWidth={0.9} strokeLinejoin="round">
        {Array.from({ length: RAY_COUNT }, (_, i) => (
          <path
            key={i}
            d={i % 2 === 0 ? STRAIGHT_RAY : WAVY_RAY}
            transform={`rotate(${(i * 360) / RAY_COUNT})`}
          />
        ))}
      </g>

      <circle r={24} fill={`url(#${faceId})`} stroke="#b06e05" strokeWidth={2} />

      {withFace ? (
        <g fill="none" stroke="#9a5d04" strokeWidth={1.8} strokeLinecap="round">
          {/* Cejas */}
          <path d="M-13,-9 Q-8,-13 -3,-9" />
          <path d="M3,-9 Q8,-13 13,-9" />
          {/* Ojos */}
          <path d="M-12,-4 Q-8,-1 -4,-4" />
          <path d="M4,-4 Q8,-1 12,-4" />
          {/* Nariz */}
          <path d="M0,-6 L-2,5 Q0,7 2,5" />
          {/* Boca */}
          <path d="M-7,11 Q0,16 7,11" />
        </g>
      ) : null}
    </svg>
  );
}
