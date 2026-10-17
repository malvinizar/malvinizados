import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Ribbon } from "./Ribbon";

interface CreamCardProps {
  children: ReactNode;
  /** Título en cinta, montado sobre el borde superior de la tarjeta. */
  title?: string;
  titleTone?: "celeste" | "gold";
  className?: string;
  bodyClassName?: string;
}

/** Tarjeta crema con borde dorado y cinta de título opcional. */
export function CreamCard({ children, title, titleTone, className, bodyClassName }: CreamCardProps) {
  return (
    <section className={cn("relative w-full", title && "pt-6", className)}>
      {title ? (
        <div className="absolute inset-x-0 top-0 z-10">
          <Ribbon as="h2" tone={titleTone} className="w-[min(18rem,90%)]">
            {title}
          </Ribbon>
        </div>
      ) : null}
      <div className={cn("cream-card px-5 pb-6", title ? "pt-10" : "pt-6", bodyClassName)}>{children}</div>
    </section>
  );
}
