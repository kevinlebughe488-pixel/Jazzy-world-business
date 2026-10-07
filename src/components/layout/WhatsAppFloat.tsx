"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { usePanier } from "@/lib/cart";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Bouton WhatsApp flottant (bas à droite), masqué sur la page panier et quand le tiroir est ouvert. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const tiroirOuvert = usePanier((s) => s.tiroirOuvert);
  const reduire = useReducedMotion();
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setPret(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  // Sur l'accueil, le hero a déjà un bouton WhatsApp : on attend que le visiteur ait défilé.
  const surAccueil = pathname === "/" || pathname === "";
  const { scrollY } = useScroll();
  const [defile, setDefile] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setDefile(y > window.innerHeight * 0.6));

  const surPanier = pathname?.replace(/\/+$/, "") === "/panier";
  const visible = pret && !surPanier && !tiroirOuvert && (!surAccueil || defile);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="whatsapp-float"
          href={lienWhatsApp(messageQuestion())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire sur WhatsApp"
          title="Écrire sur WhatsApp"
          initial={reduire ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduire ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-encre ring-1 ring-inset ring-trait-fort shadow-releve ring-4 ring-papier transition-[background-color,transform] duration-300 hover:bg-whatsapp-fonce active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre sm:right-6"
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <WhatsAppIcon className="size-7" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
