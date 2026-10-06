"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Trash2, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Props = { lien: string; onFermer: () => void; onVider: () => void };

/** Fenêtre affichée après l'ouverture de WhatsApp. À monter dans un <AnimatePresence>. */
export function ModaleSucces({ lien, onFermer, onVider }: Props) {
  const reduire = useReducedMotion();
  const panneau = useRef<HTMLDivElement>(null);
  const premier = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const precedent = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    premier.current?.focus({ preventScroll: true });

    const auClavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFermer();
      if (e.key !== "Tab" || !panneau.current) return;
      const focusables = panneau.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const debut = focusables[0];
      const fin = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === debut) {
        e.preventDefault();
        fin?.focus();
      } else if (!e.shiftKey && document.activeElement === fin) {
        e.preventDefault();
        debut?.focus();
      }
    };
    document.addEventListener("keydown", auClavier);
    return () => {
      document.removeEventListener("keydown", auClavier);
      document.body.style.overflow = overflow;
      precedent?.focus?.({ preventScroll: true });
    };
  }, [onFermer]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-noir/60 backdrop-blur-sm"
        onClick={onFermer}
      />
      <motion.div
        ref={panneau}
        role="dialog"
        aria-modal="true"
        aria-labelledby="succes-titre"
        aria-describedby="succes-texte"
        initial={reduire ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          reduire
            ? { opacity: 0 }
            : { opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.2 } }
        }
        transition={
          reduire
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 300, damping: 28 }
        }
        className="relative w-full max-w-md overflow-hidden bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center sm:p-8"
      >
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute top-3 right-3 grid size-11 place-items-center text-noir/50 transition-colors hover:bg-noir/5 hover:text-noir focus-visible:outline-2 focus-visible:outline-noir"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <motion.div
          className="relative mx-auto grid size-20 place-items-center bg-noir text-white"
          initial={reduire ? false : { scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 260,
            damping: 15,
          }}
        >
          {!reduire && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-noir"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{
                delay: 0.35,
                duration: 1.2,
                repeat: 2,
                ease: "easeOut",
              }}
            />
          )}
          <svg
            viewBox="0 0 24 24"
            className="relative size-10"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              initial={reduire ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <h2
          id="succes-titre"
          className="relative mt-6 font-affiche text-4xl uppercase leading-[0.95] text-balance"
        >
          Votre commande est prête sur WhatsApp
        </h2>
        <p id="succes-texte" className="relative mt-3 text-pretty text-gris-700">
          Envoyez le message pour la confirmer. Nous vous répondons rapidement
          pour fixer le prix et l&apos;heure de livraison. Vous payez cash à la
          réception.
        </p>

        <div className="relative mt-7 flex flex-col gap-3">
          <a
            ref={premier}
            href={lien}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-2 bg-noir px-6 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-white transition-transform hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
          >
            <WhatsAppIcon className="size-5" />
            Rouvrir WhatsApp
            <ExternalLink className="size-4 opacity-80" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onVider}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-6 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-noir ring-1 ring-inset ring-noir transition-colors hover:bg-noir hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Vider le panier
          </button>
          <button
            type="button"
            onClick={onFermer}
            className="min-h-11 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gris-500 hover:text-noir focus-visible:outline-2 focus-visible:outline-noir"
          >
            Garder mon panier
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
