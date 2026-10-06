"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primaire" | "secondaire" | "whatsapp" | "fantome" | "inverse";

const styles: Record<Variante, string> = {
  primaire: "bg-noir text-white hover:bg-gris-700",
  secondaire: "bg-white text-noir ring-1 ring-inset ring-noir hover:bg-noir hover:text-white",
  whatsapp: "bg-whatsapp text-noir hover:bg-whatsapp-fonce",
  fantome: "text-noir hover:bg-noir/5",
  /** Bouton blanc, pour les fonds noirs */
  inverse: "bg-white text-noir hover:bg-gris-200",
};

const base =
  "inline-flex min-h-13 items-center justify-center gap-2.5 px-7 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir disabled:opacity-50 disabled:pointer-events-none";

type Commun = { variante?: Variante; className?: string; children: ReactNode };

export function Button({
  variante = "primaire",
  className,
  children,
  ...props
}: Commun & Omit<ComponentProps<typeof motion.button>, "children">) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={clsx(base, styles[variante], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

export function ButtonLink({
  href,
  variante = "primaire",
  className,
  children,
  externe,
}: Commun & { href: string; externe?: boolean }) {
  const extra = externe ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <MotionLink
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={clsx(base, styles[variante], className)}
      {...extra}
    >
      {children}
    </MotionLink>
  );
}
