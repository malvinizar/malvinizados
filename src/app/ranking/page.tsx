import type { Metadata } from "next";
import { Suspense } from "react";
import { RankingScreen } from "@/features/ranking/RankingScreen";

export const metadata: Metadata = {
  title: "Ranking · MalvinizAR",
};

export default function RankingPage() {
  // Suspense es necesario porque la pantalla lee parámetros de la URL (?escuela=).
  return (
    <Suspense>
      <RankingScreen />
    </Suspense>
  );
}
