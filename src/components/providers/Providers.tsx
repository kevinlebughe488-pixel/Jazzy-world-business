"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { DefilementFluide } from "./DefilementFluide";
import { BarreProgression } from "./BarreProgression";
import { IntroMarque } from "./IntroMarque";

/**
 * Fournisseurs globaux côté client :
 * - MotionConfig respecte « réduire les animations » du système ;
 * - défilement fluide (Lenis) sur ordinateur uniquement ;
 * - barre de progression de lecture ;
 * - intro de marque jouée une fois par session (superposée, le contenu reste rendu).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DefilementFluide />
      <BarreProgression />
      {children}
      <IntroMarque />
    </MotionConfig>
  );
}
