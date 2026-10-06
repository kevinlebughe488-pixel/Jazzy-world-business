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
        className="absolute inset-0 bg-nuit-900/60 backdrop-blur-sm"
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
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-2xl shadow-nuit/30 sm:p-8"
      >
        <div
          aria-hidden="true"
          className="degrade-marque pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        />
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-nuit/50 transition-colors hover:bg-nuit/5 hover:text-nuit focus-visible:outline-2 focus-visible:outline-bleu"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <motion.div
          className="relative mx-auto grid size-20 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/40"
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
              className="absolute inset-0 rounded-full bg-whatsapp"
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
          className="relative mt-6 text-2xl font-bold text-balance"
        >
          Votre commande est prête sur WhatsApp
        </h2>
        <p id="succes-texte" className="relative mt-3 text-pretty text-nuit/70">
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
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-white shadow-lg shadow-whatsapp/30 transition-transform hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
          >
            <WhatsAppIcon className="size-5" />
            Rouvrir WhatsApp
            <ExternalLink className="size-4 opacity-80" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onVider}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-nuit ring-1 ring-nuit/15 transition-colors hover:bg-nuit/[0.03] hover:ring-nuit/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Vider le panier
          </button>
          <button
            type="button"
            onClick={onFermer}
            className="min-h-11 rounded-full text-sm font-medium text-nuit/60 hover:text-nuit focus-visible:outline-2 focus-visible:outline-bleu"
          >
            Garder mon panier
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
