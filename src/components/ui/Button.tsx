"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primaire" | "secondaire" | "whatsapp" | "fantome";

const styles: Record<Variante, string> = {
  primaire: "degrade-marque text-white shadow-lg shadow-violet/30 hover:shadow-violet/50",
  secondaire: "bg-white text-nuit ring-1 ring-nuit/10 hover:ring-nuit/25",
  whatsapp: "bg-whatsapp text-white shadow-lg shadow-whatsapp/30 hover:shadow-whatsapp/50",
  fantome: "text-nuit hover:bg-nuit/5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet disabled:opacity-50 disabled:pointer-events-none";

type Commun = { variante?: Variante; className?: string; children: ReactNode };

export function Button({
  variante = "primaire",
  className,
  children,
  ...props
}: Commun & Omit<ComponentProps<typeof motion.button>, "children">) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={clsx(base, styles[variante], className)}
      {...extra}
    >
      {children}
    </MotionLink>
  );
}
