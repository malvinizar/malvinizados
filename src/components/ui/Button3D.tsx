"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { sound } from "@/lib/sound";

export type Button3DVariant = "yellow" | "celeste" | "green" | "red" | "cream" | "navy";
export type Button3DSize = "md" | "lg" | "xl";

const variantClass: Record<Button3DVariant, string> = {
  yellow: "",
  celeste: "btn3d-celeste",
  green: "btn3d-green",
  red: "btn3d-red",
  cream: "btn3d-cream",
  navy: "btn3d-navy",
};

const sizeClass: Record<Button3DSize, string> = {
  md: "min-h-12 px-5 text-lg",
  lg: "min-h-14 px-6 text-xl",
  xl: "min-h-[4.5rem] px-8 text-3xl",
};

interface Button3DProps {
  children: ReactNode;
  variant?: Button3DVariant;
  size?: Button3DSize;
  /** Si se indica, el botón navega a esa ruta. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  icon?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  /** Pulso suave para llamar la atención (por ejemplo, ¡JUGAR!). */
  pulse?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Botón grande con canto inferior, estilo juego móvil.
 * El contenedor animado maneja hover; el botón maneja el "hundirse" al tocar.
 */
export function Button3D({
  children,
  variant = "yellow",
  size = "lg",
  href,
  onClick,
  icon,
  disabled = false,
  type = "button",
  pulse = false,
  className,
  ariaLabel,
}: Button3DProps) {
  const classes = cn("btn3d", variantClass[variant], sizeClass[size]);

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    sound.play("tap", 0.6);
    onClick?.(event);
  };

  const content = (
    <>
      {icon ? (
        <span className="relative flex shrink-0 items-center" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="relative">{children}</span>
    </>
  );

  return (
    <motion.div
      className={cn("w-full", pulse && !disabled && "animate-pulse-soft", className)}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      {href && !disabled ? (
        <Link href={href} className={classes} onClick={handleClick} aria-label={ariaLabel}>
          {content}
        </Link>
      ) : (
        <button
          type={type}
          className={classes}
          onClick={handleClick}
          disabled={disabled}
          aria-disabled={disabled}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      )}
    </motion.div>
  );
}
