"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useReducer, useState } from "react";
import { Button3D } from "@/components/ui/Button3D";
import { CATEGORY_BY_ID, type CategoriaId } from "@/config/categories";
import { GAME_CONFIG } from "@/config/game";
import { QuestionScreen } from "@/features/question/QuestionScreen";
import { PREGUNTAS } from "@/features/questions/bank";
import { CategoryReveal } from "@/features/wheel/CategoryReveal";
import { ComodinPicker } from "@/features/wheel/ComodinPicker";
import { SECTORS } from "@/features/wheel/sectors";
import { useWheelSpin } from "@/features/wheel/useWheelSpin";
import { Wheel } from "@/features/wheel/Wheel";
import { GameHud } from "./GameHud";
import { GameOver } from "./GameOver";
import { gameReducer, initialGameState } from "./gameMachine";
import { availableCategories, pickQuestion, pickSector } from "./questionPicker";
import { calcularStats } from "./stats";

const TOTAL = Math.min(GAME_CONFIG.preguntasPorPartida, PREGUNTAS.length);

/** Pantalla de juego: ruleta → categoría → pregunta → explicación → otra vez. */
export function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => initialGameState(TOTAL, Date.now()));
  const { rotation, pointer, spinning, spin } = useWheelSpin();
  const [highlight, setHighlight] = useState<number | null>(null);
  const stats = useMemo(() => calcularStats(state.historial, state.total), [state.historial, state.total]);

  const handleSpin = useCallback(async () => {
    if (state.phase !== "idle") return;
    const sector = pickSector(state.usadas);
    setHighlight(null);
    dispatch({ type: "SPIN", sector });
    await spin(sector);
    setHighlight(sector);
    const s = SECTORS[sector];
    // Pausa corta para que se vea dónde cayó antes de celebrar.
    window.setTimeout(() => {
      dispatch({ type: "SPIN_END", categoria: s.kind === "categoria" ? s.category.id : null });
    }, 650);
  }, [state.phase, state.usadas, spin]);

  const handleRevealDone = useCallback(() => {
    if (!state.categoria) return;
    const current = pickQuestion(state.categoria, state.usadas);
    if (current) {
      setHighlight(null);
      dispatch({ type: "SHOW_QUESTION", current });
    }
  }, [state.categoria, state.usadas]);

  const handlePick = useCallback((categoria: CategoriaId) => {
    dispatch({ type: "PICK_CATEGORY", categoria });
  }, []);

  const restart = useCallback(() => {
    setHighlight(null);
    dispatch({ type: "RESTART", total: TOTAL, now: Date.now() });
  }, []);

  const showWheel = state.phase === "idle" || state.phase === "spinning" || state.phase === "reveal" || state.phase === "comodin";
  const showQuestion = (state.phase === "question" || state.phase === "answered") && state.current;
  const numero = state.historial.length + (state.phase === "answered" ? 0 : 1);

  return (
    <main className={`mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-5 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] lg:grid lg:h-dvh lg:max-w-[1800px] lg:grid-rows-[minmax(0,1fr)] lg:items-stretch lg:gap-12 lg:px-12 lg:py-10 ${state.phase === "finished" ? "lg:grid-cols-1" : "lg:grid-cols-[380px_minmax(0,1fr)]"}`}>
      {state.phase !== "finished" ? <GameHud historial={state.historial} total={state.total} stats={stats} /> : null}

      <AnimatePresence mode="wait">
        {showWheel ? (
          <motion.div
            key="wheel"
            className="flex w-full flex-1 flex-col items-center justify-center gap-8 lg:min-h-0 lg:gap-6"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <motion.p
              className="text-game text-center text-3xl text-white [--stroke-c:#0a1a3a] [--stroke-w:6px] [--drop:3px] lg:text-5xl lg:[--stroke-w:9px] lg:[--drop:5px]"
              animate={{ opacity: spinning ? 0.6 : 1 }}
            >
              {spinning ? "¡Girando!" : `Pregunta ${Math.min(numero, state.total)} de ${state.total}`}
            </motion.p>

            <Wheel
              rotation={rotation}
              pointer={pointer}
              spinning={spinning}
              highlight={highlight}
              onSpin={handleSpin}
              disabled={state.phase !== "idle"}
            />

            <div className="w-full max-w-xs lg:max-w-md">
              <Button3D size="xl" onClick={handleSpin} disabled={state.phase !== "idle"} pulse={state.phase === "idle"}>
                ¡Girar!
              </Button3D>
            </div>
          </motion.div>
        ) : null}

        {showQuestion && state.current ? (
          <QuestionScreen
            key={`q-${state.current.pregunta.id}`}
            current={state.current}
            elegida={state.elegida}
            numero={state.historial.length + (state.phase === "answered" ? 0 : 1)}
            total={state.total}
            onAnswer={(index) => dispatch({ type: "ANSWER", index })}
            onContinue={() => dispatch({ type: "NEXT" })}
            esUltima={state.historial.length >= state.total}
            resultado={state.phase === "answered" ? (state.historial[state.historial.length - 1] ?? null) : null}
          />
        ) : null}

        {state.phase === "finished" ? (
          <GameOver
            key="fin"
            stats={stats}
            segundos={Math.round(((state.fin ?? Date.now()) - state.inicio) / 1000)}
            onRestart={restart}
          />
        ) : null}
      </AnimatePresence>

      {/* Superposiciones de la ruleta */}
      <AnimatePresence>
        {state.phase === "reveal" && state.categoria ? (
          <CategoryReveal key="reveal" category={CATEGORY_BY_ID[state.categoria]} onDone={handleRevealDone} />
        ) : null}
        {state.phase === "comodin" ? (
          <ComodinPicker key="comodin" available={availableCategories(state.usadas)} onPick={handlePick} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
