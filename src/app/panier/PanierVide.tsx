"use client";

import Image from "next/image";
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
          initial: { opacity: 0, y: 24, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.7, delay: delai, ease },
        };

  return (
    <Container className="flex min-h-[80svh] flex-col items-center justify-center pt-28 pb-20 text-center">
      <motion.div
        className="relative mb-10 size-44 sm:size-52"
        initial={
          reduire ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -20 }
        }
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={
          reduire
            ? { duration: 0.3 }
            : { type: "spring", stiffness: 140, damping: 16 }
        }
      >
        <div
          aria-hidden="true"
          className="degrade-marque absolute inset-4 rounded-full opacity-30 blur-3xl"
        />
        <motion.div
          className="relative size-full"
          animate={reduire ? undefined : { y: [0, -10, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/brand/globe.webp"
            alt=""
            width={600}
            height={600}
            priority
            className="size-full object-contain drop-shadow-xl"
          />
        </motion.div>
        <motion.span
          className="absolute -right-1 bottom-3 grid size-14 place-items-center rounded-2xl bg-white text-bleu shadow-lg shadow-nuit/10 ring-1 ring-nuit/5"
          initial={
            reduire ? { opacity: 0 } : { opacity: 0, scale: 0, rotate: 30 }
          }
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={
            reduire
              ? { duration: 0.3 }
              : { delay: 0.45, type: "spring", stiffness: 260, damping: 14 }
          }
        >
          <ShoppingBag className="size-6" aria-hidden="true" />
        </motion.span>
      </motion.div>

      <motion.p
        {...entree(0.15)}
        className="text-sm font-semibold uppercase tracking-[0.2em] text-bleu"
      >
        Mon panier
      </motion.p>
      <motion.h1
        {...entree(0.25)}
        className="mt-3 text-4xl font-bold text-balance sm:text-5xl"
      >
        Votre panier est <span className="texte-degrade">encore vide</span>
      </motion.h1>
      <motion.p
        {...entree(0.35)}
        className="mt-4 max-w-md text-lg text-pretty text-nuit/70"
      >
        Découvrez nos produits bien-être, santé et accessoires, livrés partout à
        Kinshasa avec paiement cash à la livraison.
      </motion.p>
      <motion.div {...entree(0.45)} className="mt-9">
        <ButtonLink href="/boutique/" className="group min-h-14 px-8 text-lg">
          Découvrir la boutique
          <ArrowRight
            className="size-5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </ButtonLink>
      </motion.div>
    </Container>
  );
}
