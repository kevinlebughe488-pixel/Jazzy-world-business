"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { usePanier, type LigneDetaillee } from "@/lib/cart";
import { formatUSD } from "@/lib/format";

type Props = { ligne: LigneDetaillee; index: number };

const boutonStepper =
  "grid size-9 place-items-center rounded-full text-nuit transition-colors hover:bg-nuit/5 active:bg-nuit/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet disabled:opacity-35 disabled:pointer-events-none";

export const CartDrawerLine = forwardRef<HTMLLIElement, Props>(function CartDrawerLine({ ligne, index }, ref) {
  const { produit, quantite, total } = ligne;
  const changerQuantite = usePanier((s) => s.changerQuantite);
  const retirer = usePanier((s) => s.retirer);
  const fermerTiroir = usePanier((s) => s.fermerTiroir);
  const reduire = useReducedMotion();
  const image = produit.images[0];

  return (
    <motion.li
      ref={ref}
      layout={!reduire}
      initial={reduire ? { opacity: 0 } : { opacity: 0, x: 40 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { delay: reduire ? 0 : 0.12 + index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={
        reduire
          ? { opacity: 0, transition: { duration: 0.15 } }
          : { opacity: 0, x: 80, scale: 0.92, filter: "blur(4px)", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }
      }
      className="group relative flex gap-4 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-nuit/5"
    >
      <Link
        href={`/produits/${produit.id}/`}
        onClick={fermerTiroir}
        className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
        aria-label={`Voir ${produit.nom}`}
      >
        {image ? (
          <Image
            src={image}
            alt={produit.nom}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/produits/${produit.id}/`}
            onClick={fermerTiroir}
            className="line-clamp-2 pt-0.5 font-display text-[15px] leading-snug font-semibold text-nuit hover:text-violet focus-visible:underline focus-visible:outline-none"
          >
            {produit.nom}
          </Link>
          <motion.button
            type="button"
            onClick={() => retirer(produit.id)}
            whileTap={{ scale: 0.85 }}
            aria-label={`Retirer ${produit.nom} du panier`}
            className="-mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-full text-nuit/45 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-violet"
          >
            <Trash2 className="size-[18px]" aria-hidden="true" />
          </motion.button>
        </div>

        <p className="text-sm text-nuit/60">{formatUSD(produit.prix)} l’unité</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div
            role="group"
            aria-label={`Quantité de ${produit.nom}`}
            className="flex items-center rounded-full bg-creme p-0.5 ring-1 ring-nuit/10"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => changerQuantite(produit.id, quantite - 1)}
              aria-label={quantite <= 1 ? `Retirer ${produit.nom}` : "Diminuer la quantité"}
              className={boutonStepper}
            >
              {quantite <= 1 ? <Trash2 className="size-4" aria-hidden="true" /> : <Minus className="size-4" aria-hidden="true" />}
            </motion.button>
            <span className="relative grid h-9 w-8 place-items-center overflow-hidden font-display text-base font-semibold tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={quantite}
                  initial={reduire ? { opacity: 0 } : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduire ? { opacity: 0 } : { y: -14, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {quantite}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => changerQuantite(produit.id, quantite + 1)}
              disabled={quantite >= 99}
              aria-label="Augmenter la quantité"
              className={boutonStepper}
            >
              <Plus className="size-4" aria-hidden="true" />
            </motion.button>
          </div>
          <p className="font-display text-base font-bold text-nuit tabular-nums">{formatUSD(total)}</p>
        </div>
      </div>
    </motion.li>
  );
});
