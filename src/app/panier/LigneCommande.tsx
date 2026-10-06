"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { usePanier, type LigneDetaillee } from "@/lib/cart";
import { getCategorie } from "@/lib/catalogue";
import { formatUSD } from "@/lib/format";

type Props = {
  ligne: LigneDetaillee;
  index: number;
  onRetirer: (id: string, quantite: number) => void;
};

const boutonStepper =
  "grid size-11 place-items-center text-noir transition-colors hover:bg-white active:bg-gris-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-noir disabled:opacity-30 disabled:pointer-events-none";

export const LigneCommande = forwardRef<HTMLLIElement, Props>(
  function LigneCommande({ ligne, index, onRetirer }, ref) {
    const { produit, quantite, total } = ligne;
    const changerQuantite = usePanier((s) => s.changerQuantite);
    const reduire = useReducedMotion();
    const image = produit.images[0];
    const categorie = getCategorie(produit.categorie)?.nom;
    const lien = `/produits/${produit.id}/`;

    return (
      <motion.li
        ref={ref}
        layout={!reduire}
        initial={
          reduire ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(6px)" }
        }
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            delay: reduire ? 0 : 0.15 + index * 0.08,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        exit={
          reduire
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                opacity: 0,
                x: -60,
                scale: 0.94,
                filter: "blur(4px)",
                transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
              }
        }
        className="group relative flex gap-4 bg-white p-3 ring-1 ring-gris-200 transition-shadow sm:gap-5 sm:p-4"
      >
        <Link
          href={lien}
          tabIndex={-1}
          aria-hidden="true"
          className="relative size-24 shrink-0 overflow-hidden bg-gris-50 sm:size-32"
        >
          {image ? (
            <Image
              src={image}
              alt={produit.nom}
              fill
              sizes="(min-width: 640px) 128px, 96px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : null}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {categorie ? (
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gris-500">
                  {categorie}
                </p>
              ) : null}
              <Link
                href={lien}
                className="mt-0.5 block text-sm leading-snug font-semibold text-noir hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir sm:text-lg"
              >
                {produit.nom}
              </Link>
              <p className="mt-0.5 text-sm text-noir/60">
                {formatUSD(produit.prix)} / unité
              </p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => onRetirer(produit.id, quantite)}
              aria-label={`Retirer ${produit.nom} du panier`}
              className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center text-noir/45 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-noir"
            >
              <Trash2 className="size-[1.15rem]" aria-hidden="true" />
            </motion.button>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div
              role="group"
              aria-label={`Quantité de ${produit.nom}`}
              className="flex items-center bg-gris-50 p-0.5 ring-1 ring-gris-200"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                className={boutonStepper}
                onClick={() => changerQuantite(produit.id, quantite - 1)}
                disabled={quantite <= 1}
                aria-label="Diminuer la quantité"
              >
                <Minus className="size-4" aria-hidden="true" />
              </motion.button>
              <span
                className="relative grid h-11 w-9 place-items-center overflow-hidden font-display text-base font-semibold tabular-nums"
                aria-live="polite"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={quantite}
                    initial={reduire ? { opacity: 0 } : { y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduire ? { opacity: 0 } : { y: -14, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {quantite}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                className={boutonStepper}
                onClick={() => changerQuantite(produit.id, quantite + 1)}
                disabled={quantite >= 99}
                aria-label="Augmenter la quantité"
              >
                <Plus className="size-4" aria-hidden="true" />
              </motion.button>
            </div>

            <div className="text-right">
              <p className="text-[0.7rem] font-medium uppercase tracking-wider text-noir/45">
                Total
              </p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={total}
                  initial={reduire ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-lg font-extrabold tabular-nums text-noir sm:text-xl"
                >
                  {formatUSD(total)}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.li>
    );
  },
);
