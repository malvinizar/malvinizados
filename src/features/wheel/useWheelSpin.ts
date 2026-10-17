"use client";

import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { GAME_CONFIG } from "@/config/game";
import { sound } from "@/lib/sound";
import { computeTargetRotation, sectorAtPointer } from "./sectors";

/**
 * Lógica del giro: rotación de la ruleta, aguja que "patea" en cada sector
 * y sonidos (preparados para cuando se agreguen los audios).
 */
export function useWheelSpin() {
  const rotation = useMotionValue(0);
  const pointer = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const spinningRef = useRef(false);
  const lastSector = useRef(sectorAtPointer(0));

  // Cada vez que la aguja cruza un borde: tick + golpecito de la aguja.
  useMotionValueEvent(rotation, "change", (value) => {
    const current = sectorAtPointer(value);
    if (current !== lastSector.current) {
      lastSector.current = current;
      sound.play("tick", 0.45);
      animate(pointer, [-26, 0], { duration: 0.18, ease: "easeOut" });
    }
  });

  /** Gira y frena en el sector indicado. Se resuelve cuando la ruleta se detiene. */
  const spin = useCallback(
    async (targetIndex: number) => {
      if (spinningRef.current) return;
      spinningRef.current = true;
      setSpinning(true);
      sound.play("spinStart");

      const start = rotation.get();
      const turns =
        GAME_CONFIG.vueltasMin +
        Math.floor(Math.random() * (GAME_CONFIG.vueltasMax - GAME_CONFIG.vueltasMin + 1));
      const final = computeTargetRotation(start, targetIndex, turns);

      // Pequeño impulso hacia atrás (anticipación) antes de arrancar.
      await animate(rotation, start - 14, { duration: 0.22, ease: "easeOut" });
      // Aceleración corta y desaceleración larga.
      await animate(rotation, final, {
        duration: GAME_CONFIG.duracionGiro,
        ease: [0.3, 0.02, 0.12, 1],
      });
      // Rebote final de la aguja.
      animate(pointer, [0, -14, 6, 0], { duration: 0.45, ease: "easeOut" });

      sound.play("spinStop");
      spinningRef.current = false;
      setSpinning(false);
    },
    [rotation, pointer],
  );

  return { rotation, pointer, spinning, spin };
}
