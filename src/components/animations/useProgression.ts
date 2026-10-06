"use client";

import { useEffect, type RefObject } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Decalage = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Progression du défilement d'un élément (0 → 1), lissée par un ressort.
 * Si l'utilisateur a demandé de réduire les animations, elle reste figée sur `repos`
 * (0 = état de départ, 1 = état d'arrivée) : choisir la valeur où tout est lisible.
 */
export function useProgression(
  cible: RefObject<HTMLElement | null>,
  decalage: Decalage = ["start start", "end end"],
  lissage = true,
  repos = 0,
): MotionValue<number> {
  const reduit = useReducedMotion();
  const actif = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: cible, offset: decalage });
  const lisse = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35, restDelta: 0.0005 });

  useEffect(() => {
    actif.set(reduit ? 0 : 1);
  }, [reduit, actif]);

  return useTransform([lissage ? lisse : scrollYProgress, actif], ([p, a]: number[]) => (a ? p : repos));
}
