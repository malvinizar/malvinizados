import { cn } from "@/lib/cn";

interface UnpilarLogoProps {
  className?: string;
}

/** Logo oficial de la Universidad Nacional de Pilar (versión blanca, para fondo azul). */
export function UnpilarLogo({ className }: UnpilarLogoProps) {
  return (
    <a
      href="https://unpilar.edu.ar"
      target="_blank"
      rel="noopener noreferrer"
      className={cn("block opacity-90 transition-opacity hover:opacity-100", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/unpilar-logo-blanco.png`}
        alt="Universidad Nacional de Pilar"
        width={607}
        height={84}
        className="h-auto w-full drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]"
      />
    </a>
  );
}
