"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variantes: Variants = {
  cache: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Fait apparaître son contenu (fondu + glissement) quand il entre à l'écran. */
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
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: delai, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
