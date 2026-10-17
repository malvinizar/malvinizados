import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatPillProps {
  icon: ReactNode;
  value: ReactNode;
  label?: string;
  className?: string;
}

/**
 * Contador en píldora crema con ícono a la izquierda
 * (como los contadores de la columna derecha de la referencia).
 * Se usará en el HUD: puntaje, racha y aciertos.
 */
export function StatPill({ icon, value, label, className }: StatPillProps) {
  return (
    <div className={cn("relative flex h-10 items-center pl-6", className)} aria-label={label}>
      <div className="absolute left-0 z-10 grid size-10 place-items-center rounded-full border-[3px] border-gold-dark bg-linear-to-b from-gold-light to-gold shadow-[0_3px_0_var(--color-gold-dark)]">
        {icon}
      </div>
      <div className="flex h-8 min-w-20 items-center justify-end rounded-full border-[3px] border-cream-border bg-cream pl-6 pr-3 font-display text-lg text-ink shadow-[0_3px_0_var(--color-cream-edge)]">
        {value}
      </div>
    </div>
  );
}
