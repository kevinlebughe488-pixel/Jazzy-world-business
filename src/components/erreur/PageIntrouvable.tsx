"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, House, Info, ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

const raccourcis = [
  { href: "/", label: "Accueil", detail: "Revenir à la page d’accueil", Icone: House },
  { href: "/boutique/", label: "Boutique", detail: "Voir tous nos produits", Icone: ShoppingBag },
  { href: "/infos/", label: "Infos pratiques", detail: "Livraison, paiement, contact", Icone: Info },
];

export function PageIntrouvable() {
  const reduit = useReducedMotion();

  const conteneur: Variants = {
    cache: {},
    visible: { transition: { staggerChildren: reduit ? 0 : 0.09, delayChildren: reduit ? 0 : 0.15 } },
  };
  const element: Variants = {
    cache: reduit ? { opacity: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-24 lg:pb-28 lg:pt-28">
      <Container>
        <motion.div
          variants={conteneur}
          initial="cache"
          animate="visible"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          {/* 404 géant : le zéro tourne comme une roue */}
          <motion.div
            variants={element}
            aria-hidden="true"
            className="relative mb-6 flex select-none items-center justify-center font-affiche text-[38vw] leading-[0.85] text-noir sm:text-[15rem]"
          >
            <span>4</span>
            <motion.span
              className="texte-contour inline-block [-webkit-text-stroke-width:3px]"
              animate={reduit ? undefined : { rotate: [0, 0, 360] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: [0.76, 0, 0.24, 1], times: [0, 0.5, 1] }}
            >
              0
            </motion.span>
            <span>4</span>
          </motion.div>

          <motion.p
            variants={element}
            className="mb-3 inline-flex items-center bg-noir px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white"
          >
            Erreur 404
          </motion.p>

          <motion.h1
            variants={element}
            className="font-affiche text-5xl uppercase leading-[0.92] text-noir text-balance sm:text-7xl"
          >
            Oups, cette page a fait le tour du monde…
          </motion.h1>

          <motion.p variants={element} className="mt-4 max-w-xl text-base text-noir/70 text-pretty sm:text-lg">
            La page que vous cherchez n’existe pas ou a été déplacée. Pas d’inquiétude : nos produits, eux, sont
            toujours livrés partout à Kinshasa.
          </motion.p>

          <motion.div variants={element} className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/boutique/" className="w-full sm:w-auto">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              Voir la boutique
            </ButtonLink>
            <ButtonLink
              href={lienWhatsApp(messageQuestion())}
              externe
              variante="whatsapp"
              className="w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Nous écrire sur WhatsApp
            </ButtonLink>
          </motion.div>

          {/* Raccourcis */}
          <motion.ul variants={conteneur} className="mt-12 grid w-full gap-3 sm:grid-cols-3">
            {raccourcis.map(({ href, label, detail, Icone }) => (
              <motion.li key={href} variants={element}>
                <Link
                  href={href}
                  className="group flex h-full items-center gap-3 bg-white p-4 text-left ring-1 ring-gris-200 transition hover:-translate-y-0.5 hover:ring-noir focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
                >
                  <span className="bg-noir flex h-11 w-11 shrink-0 items-center justify-center text-white">
                    <Icone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold uppercase tracking-[0.1em] text-noir">{label}</span>
                    <span className="block text-sm text-noir/60">{detail}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-noir/30 transition group-hover:translate-x-1 group-hover:text-noir"
                    aria-hidden="true"
                  />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </section>
  );
}
