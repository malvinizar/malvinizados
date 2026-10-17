"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { Button3D } from "@/components/ui/Button3D";
import { CreamCard } from "@/components/ui/CreamCard";

interface ComingSoonProps {
  title: string;
  text: string;
}

/** Pantalla provisoria para secciones que todavía se están construyendo. */
export function ComingSoon({ title, text }: ComingSoonProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-10 px-4 py-12">
      <Logo compact />
      <motion.div
        className="w-full"
        initial={{ y: 40, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
      >
        <CreamCard title={title}>
          <p className="mb-6 text-center text-lg font-bold text-ink-soft">{text}</p>
          <Button3D href="/" variant="cream">
            Volver al menú
          </Button3D>
        </CreamCard>
      </motion.div>
    </main>
  );
}
