"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { synchroniserPanierEntreOnglets } from "@/lib/cart";
import { EnergieDefilement } from "@/components/animations/Energie";
import { DefilementFluide } from "./DefilementFluide";
import { BarreProgression } from "./BarreProgression";
import { IntroMarque } from "./IntroMarque";

/**
 * Fournisseurs globaux côté client :
 * - MotionConfig respecte « réduire les animations » du système ;
 * - intro de marque jouée une fois par session (placée en premier : son script
 *   s'exécute avant que le reste de la page soit lu par le navigateur) ;
 * - défilement fluide (Lenis) sur ordinateur uniquement ;
 * - énergie de défilement partagée (vitesse + profondeur) pour les animations ;
 * - barre de progression de lecture ;
 * - panier identique entre plusieurs onglets ouverts.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => synchroniserPanierEntreOnglets(), []);

  return (
    <MotionConfig reducedMotion="user">
      <IntroMarque />
      <DefilementFluide />
      <EnergieDefilement>
        <BarreProgression />
        {children}
      </EnergieDefilement>
    </MotionConfig>
  );
}
