"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { sound } from "@/lib/sound";

/** Botón redondo para activar o silenciar los sonidos. Recuerda la elección. */
export function MuteButton({ className }: { className?: string }) {
  const muted = useSyncExternalStore(sound.subscribe, sound.isMuted, () => false);

  return (
    <button
      type="button"
      onClick={() => {
        sound.setMuted(!muted);
        if (muted) sound.play("tap");
      }}
      aria-pressed={muted}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-cream-border bg-cream text-ink shadow-[0_3px_0_var(--color-cream-edge)] active:translate-y-0.5",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        {muted ? (
          <path d="m16 9 5 5m0-5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        ) : (
          <path
            d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </button>
  );
}
