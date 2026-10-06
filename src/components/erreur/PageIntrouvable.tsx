"use client";

import Image from "next/image";
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
    cache: reduit ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-28 lg:pb-28 lg:pt-36">

      {/* Halos décoratifs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-bleu/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-ciel/25 blur-3xl" />
      </div>

      <Container>
        <motion.div
          variants={conteneur}
          initial="cache"
          animate="visible"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          {/* Globe + 404 */}
          <motion.div variants={element} className="relative mb-6 flex items-center justify-center">
            <span
              aria-hidden="true"
              className="texte-degrade select-none font-display text-[7.5rem] font-extrabold leading-none tracking-tighter sm:text-[11rem]"
            >
              4
            </span>
            <motion.div
              className="relative mx-1 h-28 w-28 sm:h-44 sm:w-44"
              animate={reduit ? undefined : { y: [0, -10, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div aria-hidden="true" className="absolute inset-2 rounded-full bg-ciel/40 blur-2xl" />
              {!reduit && (
                <motion.div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full border-2 border-dashed border-bleu/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              )}
              <Image
                src="/brand/globe.webp"
                alt="Globe Jazzy World Business"
                width={600}
                height={600}
                priority
                className="relative h-full w-full drop-shadow-2xl"
              />
            </motion.div>
            <span
              aria-hidden="true"
              className="texte-degrade select-none font-display text-[7.5rem] font-extrabold leading-none tracking-tighter sm:text-[11rem]"
            >
              4
            </span>
          </motion.div>

          <motion.p
            variants={element}
            className="mb-3 inline-flex items-center rounded-full bg-bleu/10 px-4 py-1.5 text-sm font-semibold text-bleu"
          >
            Erreur 404
          </motion.p>

          <motion.h1
            variants={element}
            className="font-display text-3xl font-bold tracking-tight text-nuit text-balance sm:text-5xl"
          >
            Oups, cette page a fait le tour du monde…
          </motion.h1>

          <motion.p variants={element} className="mt-4 max-w-xl text-base text-nuit/70 text-pretty sm:text-lg">
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
                  className="group flex h-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-nuit/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bleu/10 hover:ring-bleu/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
                >
                  <span className="degrade-marque flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white">
                    <Icone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-semibold text-nuit">{label}</span>
                    <span className="block text-sm text-nuit/60">{detail}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-nuit/30 transition group-hover:translate-x-1 group-hover:text-bleu"
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
