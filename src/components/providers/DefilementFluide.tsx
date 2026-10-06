"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePanier } from "@/lib/cart";

/**
 * Lenis uniquement sur pointeur précis (souris/trackpad) et sans préférence
 * « réduire les animations ». Sur mobile on garde le défilement natif (plus rapide).
 * Remonte en haut de page à chaque changement de route.
 */
export function DefilementFluide() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const tiroirOuvert = usePanier((s) => s.tiroirOuvert);

  useEffect(() => {
    const pointeurFin = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");

    const synchroniser = () => {
      const doitActiver = pointeurFin.matches && !reduit.matches;
      if (doitActiver && !lenisRef.current) {
        lenisRef.current = new Lenis({
          autoRaf: true,
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          anchors: true,
          prevent: (node) => !!node.closest?.('[role="dialog"], [data-lenis-prevent]'),
        });
      } else if (!doitActiver && lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };

    synchroniser();
    pointeurFin.addEventListener("change", synchroniser);
    reduit.addEventListener("change", synchroniser);
    return () => {
      pointeurFin.removeEventListener("change", synchroniser);
      reduit.removeEventListener("change", synchroniser);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Bloque le défilement de la page quand le tiroir du panier est ouvert.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (tiroirOuvert) lenis.stop();
    else lenis.start();
  }, [tiroirOuvert]);

  // Retour en haut à chaque nouvelle page (sauf lien vers une ancre).
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
