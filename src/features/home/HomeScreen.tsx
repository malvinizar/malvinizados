"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button3D } from "@/components/ui/Button3D";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { CreamCard } from "@/components/ui/CreamCard";
import { CATEGORIES } from "@/config/categories";
import { HowToPlayModal } from "./HowToPlayModal";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.35A5 5 0 0 1 13 14.9V17h3v4H8v-4h3v-2.1A5 5 0 0 1 8.35 12H8a4 4 0 0 1-4-4V5h3V3Zm0 4H6v1a2 2 0 0 0 1 1.73V7Zm10 0v2.73A2 2 0 0 0 18 8V7h-1Z" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm1.4-5.1c-.6.35-.9.65-.9 1.1v.5h-2v-.6c0-1.3.8-2 1.6-2.45.7-.4 1-.7 1-1.25 0-.7-.55-1.2-1.3-1.2-.8 0-1.35.5-1.45 1.3l-2-.3C8.6 7.6 10 6.5 11.9 6.5c2 0 3.3 1.2 3.3 2.85 0 1.35-.8 2.4-1.8 3.05Z" />
    </svg>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.85 } },
};

const item = {
  hidden: { y: 24, opacity: 0, scale: 0.9 },
  show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 18 } },
};

const card = {
  hidden: { y: 40, opacity: 0, scale: 0.85 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 240, damping: 18, staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

export function HomeScreen() {
  const [howToOpen, setHowToOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-between gap-6 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top))]">
      <Logo className="mt-6" />

      <motion.div className="w-full" variants={container} initial="hidden" animate="show">
        <motion.div variants={card}>
          <CreamCard title="Menú principal">
            <div className="flex flex-col gap-4">
              <motion.div variants={item}>
                <Button3D href="/jugar" size="xl" pulse icon={<PlayIcon />}>
                  ¡Jugar!
                </Button3D>
              </motion.div>
              <motion.div variants={item}>
                <Button3D href="/ranking" variant="celeste" icon={<TrophyIcon />}>
                  Ranking
                </Button3D>
              </motion.div>
              <motion.div variants={item}>
                <Button3D variant="green" icon={<QuestionIcon />} onClick={() => setHowToOpen(true)}>
                  Cómo se juega
                </Button3D>
              </motion.div>
            </div>
          </CreamCard>
        </motion.div>
      </motion.div>

      <motion.ul
        className="grid w-full grid-cols-4 gap-2"
        aria-label="Categorías"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.3 } } }}
      >
        {CATEGORIES.map((category, i) => (
          <motion.li
            key={category.id}
            variants={{
              hidden: { y: 30, opacity: 0, scale: 0.5 },
              show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 15 } },
            }}
          >
            <CategoryBadge
              category={category}
              size="md"
              showLabel
              className="animate-bob motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          </motion.li>
        ))}
      </motion.ul>

      <HowToPlayModal open={howToOpen} onClose={() => setHowToOpen(false)} />
    </main>
  );
}
