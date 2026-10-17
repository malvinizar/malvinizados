import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RibbonProps {
  children: ReactNode;
  className?: string;
  /** "celeste" (celeste y blanco) o "gold" (para logros y victorias). */
  tone?: "celeste" | "gold";
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const tones = {
  celeste: {
    tail: "#3b8fc4",
    tailFold: "#2a6a96",
    edge: "#7ec8f0",
    band: "#ffffff",
    text: "text-navy-900",
  },
  gold: {
    tail: "#c47f08",
    tailFold: "#8f5b05",
    edge: "#f5b921",
    band: "#fff4cc",
    text: "text-gold-ink",
  },
} as const;

/**
 * Cinta de título con puntas plegadas (como "MENÚ PRINCIPAL" en la referencia).
 * La forma es un SVG que se estira; el texto va por encima en HTML.
 */
export function Ribbon({ children, className, tone = "celeste", as: Tag = "span" }: RibbonProps) {
  const c = tones[tone];
  return (
    <div className={cn("relative mx-auto h-12 w-64 drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]", className)}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Colas */}
        <path d="M0 20 H38 V56 H0 L12 38 Z" fill={c.tail} />
        <path d="M300 20 H262 V56 H300 L288 38 Z" fill={c.tail} />
        {/* Pliegues */}
        <path d="M24 46 L38 56 V46 Z" fill={c.tailFold} />
        <path d="M276 46 L262 56 V46 Z" fill={c.tailFold} />
        {/* Banda principal: celeste - blanco - celeste */}
        <path d="M24 10 Q150 0 276 10 V46 Q150 36 24 46 Z" fill={c.edge} />
        <path d="M24 16 Q150 6 276 16 V40 Q150 30 24 40 Z" fill={c.band} />
      </svg>
      <Tag
        className={cn(
          "absolute inset-0 flex items-center justify-center px-10 pb-1 text-center font-display uppercase leading-none tracking-wide",
          "text-[clamp(0.85rem,3.6vw,1.1rem)]",
          c.text,
        )}
      >
        {children}
      </Tag>
    </div>
  );
}
