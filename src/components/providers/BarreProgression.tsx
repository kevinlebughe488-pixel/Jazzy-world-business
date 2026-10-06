"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Fine barre en haut de l'écran indiquant la progression du défilement (visible sur fond noir comme blanc). */
export function BarreProgression() {
  const { scrollYProgress } = useScroll();
  const reduit = useReducedMotion();
  const lisse = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.4, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-white mix-blend-difference"
      style={{ scaleX: reduit ? scrollYProgress : lisse }}
    />
  );
}
