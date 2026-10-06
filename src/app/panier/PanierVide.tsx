"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

export function PanierVide() {
  const reduire = useReducedMotion();
  const entree = (delai: number) =>
    reduire
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: delai, ease },
        };

  return (
    <Container className="flex min-h-[80svh] flex-col items-center justify-center pt-24 pb-20 text-center">
      <motion.div
        className="relative mb-10 grid size-36 place-items-center bg-noir text-white sm:size-44"
        initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -25 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={reduire ? { duration: 0.3 } : { type: "spring", stiffness: 140, damping: 14 }}
      >
        <motion.span
          animate={reduire ? undefined : { y: [0, -8, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShoppingBag className="size-14 sm:size-16" strokeWidth={1.4} aria-hidden="true" />
        </motion.span>
        <motion.span
          className="absolute -right-3 -top-3 grid size-11 place-items-center bg-white font-affiche text-xl text-noir ring-2 ring-noir"
          initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0, rotate: 30 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={reduire ? { duration: 0.3 } : { delay: 0.45, type: "spring", stiffness: 260, damping: 14 }}
          aria-hidden="true"
        >
          0
        </motion.span>
      </motion.div>

      <motion.p {...entree(0.15)} className="text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500">
        — Mon panier
      </motion.p>
      <motion.h1
        {...entree(0.25)}
        className="mt-4 font-affiche text-6xl uppercase leading-[0.9] text-balance sm:text-8xl"
      >
        Votre panier est <span className="texte-contour [-webkit-text-stroke-width:2px]">encore vide</span>
      </motion.h1>
      <motion.p {...entree(0.35)} className="mt-5 max-w-md text-lg text-pretty text-gris-700">
        Découvrez nos produits bien-être, santé et accessoires, livrés partout à Kinshasa avec paiement cash à la
        livraison.
      </motion.p>
      <motion.div {...entree(0.45)} className="mt-9">
        <ButtonLink href="/boutique/" className="group min-h-14 px-9">
          Découvrir la boutique
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </ButtonLink>
      </motion.div>
    </Container>
  );
}
