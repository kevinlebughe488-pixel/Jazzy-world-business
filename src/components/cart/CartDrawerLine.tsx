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
  "grid size-9 place-items-center rounded-full text-encre transition-colors hover:bg-encre/5 active:bg-lin focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-encre disabled:opacity-35 disabled:pointer-events-none";

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
      initial={reduire ? { opacity: 0 } : { opacity: 0, x: 24 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { delay: reduire ? 0 : 0.1 + index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
      exit={
        reduire
          ? { opacity: 0, transition: { duration: 0.15 } }
          : { opacity: 0, x: 60, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }
      }
      className="group relative flex gap-4 rounded-carte bg-carte p-2.5 shadow-doux"
    >
      <Link
        href={`/produits/${produit.id}/`}
        onClick={fermerTiroir}
        className="relative size-24 shrink-0 overflow-hidden rounded-media bg-lin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
        aria-label={`Voir ${produit.nom}`}
      >
        {image ? (
          <Image
            src={image}
            alt={produit.nom}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col py-0.5 pr-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/produits/${produit.id}/`}
            onClick={fermerTiroir}
            className="line-clamp-2 pt-0.5 font-medium leading-snug text-encre hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {produit.nom}
          </Link>
          <button
            type="button"
            onClick={() => retirer(produit.id)}
            aria-label={`Retirer ${produit.nom} du panier`}
            className="-mr-1 -mt-1 grid size-10 shrink-0 place-items-center rounded-full text-muet transition-colors hover:bg-argile/10 hover:text-argile-fonce focus-visible:outline-2 focus-visible:outline-encre"
          >
            <Trash2 className="size-[1.05rem]" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-muet">{formatUSD(produit.prix)} l’unité</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div
            role="group"
            aria-label={`Quantité de ${produit.nom}`}
            className="flex items-center rounded-full bg-papier p-0.5 ring-1 ring-inset ring-trait"
          >
            <button
              type="button"
              onClick={() => changerQuantite(produit.id, quantite - 1)}
              aria-label={quantite <= 1 ? `Retirer ${produit.nom}` : "Diminuer la quantité"}
              className={boutonStepper}
            >
              {quantite <= 1 ? <Trash2 className="size-4" aria-hidden="true" /> : <Minus className="size-4" aria-hidden="true" />}
            </button>
            <span className="relative grid h-9 w-8 place-items-center overflow-hidden font-medium tabular-nums">
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
            <button
              type="button"
              onClick={() => changerQuantite(produit.id, quantite + 1)}
              disabled={quantite >= 99}
              aria-label="Augmenter la quantité"
              className={boutonStepper}
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="font-serif text-2xl leading-none">{formatUSD(total)}</p>
        </div>
      </div>
    </motion.li>
  );
});
