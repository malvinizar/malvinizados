/**
 * Fondo del juego: azul marino con rayos de sol girando muy despacio
 * y un brillo central. Fijo detrás de todas las pantallas.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-900">
      {/* Rayos */}
      <div
        className="absolute left-1/2 top-[38%] aspect-square w-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow opacity-[0.10] motion-reduce:animate-none"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, #ffffff 0deg 7deg, transparent 7deg 18deg)",
          maskImage: "radial-gradient(circle, black 0%, black 25%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, black 25%, transparent 60%)",
        }}
      />
      {/* Brillo central */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 32%, rgba(80,140,230,0.55) 0%, rgba(31,70,135,0.35) 40%, transparent 75%)",
        }}
      />
      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(5,14,35,0.75) 100%)",
        }}
      />
    </div>
  );
}
