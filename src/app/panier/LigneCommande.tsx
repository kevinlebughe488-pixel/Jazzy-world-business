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
  "grid size-10 place-items-center rounded-full text-encre transition-colors hover:bg-carte active:bg-lin focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-encre disabled:opacity-30 disabled:pointer-events-none";

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
        initial={reduire ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: reduire ? 0 : 0.1 + index * 0.06,
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        exit={
          reduire
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                opacity: 0,
                x: -40,
                transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
              }
        }
        className="group relative flex gap-4 rounded-carte bg-carte p-2.5 shadow-doux sm:gap-5 sm:p-3"
      >
        <Link
          href={lien}
          tabIndex={-1}
          aria-hidden="true"
          className="relative size-24 shrink-0 overflow-hidden rounded-media bg-lin sm:size-32"
        >
          {image ? (
            <Image
              src={image}
              alt={produit.nom}
              fill
              sizes="(min-width: 640px) 128px, 96px"
              className="object-cover"
            />
          ) : null}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {categorie ? (
                <p className="text-xs text-muet">
                  {categorie}
                </p>
              ) : null}
              <Link
                href={lien}
                className="mt-0.5 block font-medium leading-snug text-encre hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre sm:text-lg"
              >
                {produit.nom}
              </Link>
              <p className="mt-0.5 text-sm text-muet">
                {formatUSD(produit.prix)} / unité
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRetirer(produit.id, quantite)}
              aria-label={`Retirer ${produit.nom} du panier`}
              className="-mr-1 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-muet transition-colors hover:bg-argile/10 hover:text-argile-fonce focus-visible:outline-2 focus-visible:outline-encre"
            >
              <Trash2 className="size-[1.1rem]" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div
              role="group"
              aria-label={`Quantité de ${produit.nom}`}
              className="flex items-center rounded-full bg-papier p-0.5 ring-1 ring-inset ring-trait"
            >
              <button
                type="button"
                className={boutonStepper}
                onClick={() => changerQuantite(produit.id, quantite - 1)}
                disabled={quantite <= 1}
                aria-label="Diminuer la quantité"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span
                className="relative grid h-10 w-9 place-items-center overflow-hidden font-medium tabular-nums"
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
              <button
                type="button"
                className={boutonStepper}
                onClick={() => changerQuantite(produit.id, quantite + 1)}
                disabled={quantite >= 99}
                aria-label="Augmenter la quantité"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-xs text-muet">
                Total
              </p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={total}
                  initial={reduire ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-serif text-2xl leading-none sm:text-3xl"
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
