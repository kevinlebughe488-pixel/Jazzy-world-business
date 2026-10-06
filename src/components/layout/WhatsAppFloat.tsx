"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePanier } from "@/lib/cart";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Bouton WhatsApp flottant (bas à droite), masqué sur la page panier et quand le tiroir est ouvert. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const tiroirOuvert = usePanier((s) => s.tiroirOuvert);
  const reduire = useReducedMotion();
  const [pret, setPret] = useState(false);
  const [survol, setSurvol] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setPret(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  // Sur l'accueil, le hero a déjà un gros bouton WhatsApp : on attend que le visiteur ait défilé.
  const surAccueil = pathname === "/" || pathname === "";
  const [defile, setDefile] = useState(false);
  useEffect(() => {
    if (!surAccueil) return;
    const verifier = () => setDefile(window.scrollY > window.innerHeight * 0.6);
    verifier();
    window.addEventListener("scroll", verifier, { passive: true });
    return () => window.removeEventListener("scroll", verifier);
  }, [surAccueil]);

  const surPanier = pathname?.replace(/\/+$/, "") === "/panier";
  const visible = pret && !surPanier && !tiroirOuvert && (!surAccueil || defile);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="whatsapp-float"
          className="fixed right-4 z-40 sm:right-6"
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
          initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 40 }}
          animate={reduire ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 24 }}
          transition={reduire ? { duration: 0.2 } : { type: "spring", stiffness: 380, damping: 22 }}
        >
          <motion.a
            href={lienWhatsApp(messageQuestion())}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Une question ? Écrivez-nous sur WhatsApp"
            onHoverStart={() => setSurvol(true)}
            onHoverEnd={() => setSurvol(false)}
            onFocus={() => setSurvol(true)}
            onBlur={() => setSurvol(false)}
            whileTap={reduire ? undefined : { scale: 0.92 }}
            className="group relative flex items-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-noir focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {/* Étiquette qui se déploie au survol (desktop) */}
            <AnimatePresence>
              {survol && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-noir px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/30 md:block"
                  initial={reduire ? { opacity: 0 } : { opacity: 0, x: 12, scale: 0.9 }}
                  animate={reduire ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                  exit={reduire ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  style={{ transformOrigin: "right center" }}
                >
                  Une question ?
                  <span className="absolute right-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-noir" />
                </motion.span>
              )}
            </AnimatePresence>

            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-noir text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-2 ring-white transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
              {/* Anneaux de pulsation */}
              {!reduire && (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-2 border-noir"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.75, opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-2 border-noir"
                    initial={{ scale: 1, opacity: 0.45 }}
                    animate={{ scale: 1.75, opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
                  />
                </>
              )}
              <WhatsAppIcon className="relative h-7 w-7 sm:h-8 sm:w-8" />
            </span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
