"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";

type Energie = {
  /** Progression du défilement de toute la page (0 → 1). */
  progression: MotionValue<number>;
  /** Multiplicateur d'intensité : 1 en haut de page, 3 tout en bas. Plus on descend, plus ça bouge. */
  energie: MotionValue<number>;
  /** Vitesse de défilement lissée, en px/s (négative quand on remonte). */
  vitesse: MotionValue<number>;
};

const Contexte = createContext<Energie | null>(null);

/** Partage la vitesse et la profondeur de défilement avec toutes les animations de la page. */
export function EnergieDefilement({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  const vitesseBrute = useVelocity(scrollY);
  const vitesse = useSpring(vitesseBrute, { damping: 50, stiffness: 400 });
  const energie = useTransform(scrollYProgress, [0, 1], [1, 3]);

  const valeur = useMemo(
    () => ({ progression: scrollYProgress, energie, vitesse }),
    [scrollYProgress, energie, vitesse],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useEnergie(): Energie {
  const valeur = useContext(Contexte);
  if (!valeur) throw new Error("useEnergie doit être utilisé dans <EnergieDefilement>");
  return valeur;
}

/** Inclinaison (en degrés) proportionnelle à la vitesse de défilement, amplifiée par la profondeur. */
export function useInclinaisonVitesse(max = 10): MotionValue<number> {
  const { vitesse, energie } = useEnergie();
  return useTransform([vitesse, energie], ([v, e]: number[]) => {
    const brut = (v / 2500) * max * e;
    return Math.max(-max * 1.6, Math.min(max * 1.6, brut));
  });
}
