"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { synchroniserPanierEntreOnglets } from "@/lib/cart";

/**
 * Fournisseurs globaux côté client :
 * - MotionConfig respecte « réduire les animations » du système ;
 * - panier identique entre plusieurs onglets ouverts.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => synchroniserPanierEntreOnglets(), []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
