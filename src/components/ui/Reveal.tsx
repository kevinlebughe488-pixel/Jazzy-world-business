"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variantes: Variants = {
  cache: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

/** Fait apparaître son contenu (fondu + léger glissement) quand il entre à l'écran. */
export function Reveal({
  children,
  delai = 0,
  className,
}: {
  children: ReactNode;
  delai?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variantes}
      initial="cache"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: delai, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
