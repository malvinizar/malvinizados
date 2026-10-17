import type { Metadata } from "next";
import { GameScreen } from "@/features/game/GameScreen";

export const metadata: Metadata = {
  title: "Jugar · MalvinizAR",
};

export default function JugarPage() {
  return <GameScreen />;
}
