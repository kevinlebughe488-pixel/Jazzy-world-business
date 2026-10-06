"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Phone, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { boutique } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

export function BandeauWhatsApp() {
  const ref = useRef<HTMLElement>(null);
  const reduit = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const globeY = useTransform(scrollYProgress, [0, 1], reduit ? [0, 0] : [80, -80]);
  const globeRotation = useTransform(scrollYProgress, [0, 1], reduit ? [0, 0] : [-20, 25]);
  const petitGlobeY = useTransform(scrollYProgress, [0, 1], reduit ? [0, 0] : [-40, 60]);

  return (
    <section ref={ref} aria-labelledby="titre-bandeau-whatsapp" className="relative py-16 sm:py-24">
      <Container>
        <motion.div
          initial={reduit ? false : { opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="degrade-marque relative isolate overflow-hidden rounded-[2rem] px-6 py-12 text-white shadow-2xl shadow-violet/30 sm:rounded-[2.5rem] sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        >
          {/* Reflet animé */}
          {!reduit && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["0%", "400%"] }}
              transition={{ duration: 3.2, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatDelay: 2.8 }}
            />
          )}

          {/* Texture : grille de points */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-20 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom_right,black,transparent_70%)]"
          />

          {/* Globes décoratifs en parallaxe */}
          <motion.div
            aria-hidden="true"
            style={{ y: globeY, rotate: globeRotation }}
            className="pointer-events-none absolute -bottom-24 -right-24 -z-10 w-72 opacity-40 sm:w-96 sm:opacity-60 lg:-right-10 lg:top-1/2 lg:bottom-auto lg:-mt-56 lg:w-[28rem] lg:opacity-90"
          >
            <Image src="/brand/globe.webp" alt="" width={600} height={600} className="h-auto w-full drop-shadow-2xl" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            style={{ y: petitGlobeY }}
            className="pointer-events-none absolute -left-8 -top-8 -z-10 hidden w-28 opacity-30 blur-[1px] sm:block"
          >
            <Image src="/brand/globe.webp" alt="" width={600} height={600} className="h-auto w-full" />
          </motion.div>

          <div className="relative max-w-xl lg:max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur">
              <span className="relative flex size-2.5">
                {!reduit && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-whatsapp opacity-75" />
                )}
                <span className="relative inline-flex size-2.5 rounded-full bg-whatsapp" />
              </span>
              Réponse rapide
            </span>

            <h2
              id="titre-bandeau-whatsapp"
              className="mt-5 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl"
            >
              Une question ?
              <br />
              <span className="text-ciel-200">Écrivez-nous sur WhatsApp</span>
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              Disponibilité, livraison, conseil produit : on vous répond directement, sans détour.
            </p>

            <a
              href={`tel:+${boutique.whatsapp}`}
              className="mt-6 inline-flex items-center gap-3 rounded-2xl py-1 font-display text-2xl font-bold tracking-tight tabular-nums text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-3xl"
              aria-label={`Appeler le ${boutique.whatsappAffiche}`}
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              {boutique.whatsappAffiche}
            </a>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink
                href={lienWhatsApp(messageQuestion())}
                externe
                variante="whatsapp"
                className="w-full px-8 py-4 text-lg sm:w-auto"
              >
                <WhatsAppIcon className="size-6" />
                Écrire sur WhatsApp
              </ButtonLink>
              <p className="flex items-center gap-2 text-sm text-white/75">
                <Truck className="size-4" aria-hidden="true" />
                Livraison partout à Kinshasa · Paiement cash
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
