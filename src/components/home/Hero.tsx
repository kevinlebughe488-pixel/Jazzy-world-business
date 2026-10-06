"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, Banknote, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { boutique, getProduit } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Titre : mots révélés un par un ---------- */

type Mot = { texte: string; degrade?: boolean };

const TITRE: Mot[] = [
  { texte: "Le" },
  { texte: "bien-être", degrade: true },
  { texte: "et" },
  { texte: "le" },
  { texte: "style,", degrade: true },
  { texte: "livrés" },
  { texte: "partout" },
  { texte: "à" },
  { texte: "Kinshasa", degrade: true },
];

const conteneurTitre: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
};
const conteneurTitreReduit: Variants = { cache: {}, visible: {} };

function creerMotVariantes(reduit: boolean): Variants {
  return {
    cache: { opacity: 0, y: "0.45em", filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: "0em",
      filter: "blur(0px)",
      transition: reduit ? { duration: 0 } : { duration: 0.9, ease: EASE },
    },
  };
}

function creerApparition(reduit: boolean): Variants {
  return {
    cache: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: (delai: number = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: reduit ? { duration: 0 } : { duration: 0.8, delay: delai, ease: EASE },
    }),
  };
}

/* ---------- Bulles produits en orbite ---------- */

const ORBITE = [
  { id: "montre-arabe", angle: -60 },
  { id: "lunettes-chromees", angle: 12 },
  { id: "sac-de-voyage", angle: 84 },
  { id: "tensiometre", angle: 156 },
  { id: "blanchiment-des-dents", angle: 228 },
]
  .map(({ id, angle }) => {
    const p = getProduit(id);
    return p && p.images[0] ? { id, angle, nom: p.nom, image: p.images[0] } : null;
  })
  .filter((b): b is { id: string; angle: number; nom: string; image: string } => b !== null);

const DUREE_ORBITE = 70;

/* ---------- Badges de confiance ---------- */

const BADGES = [
  { icone: MapPin, texte: "Livraison partout à Kinshasa" },
  { icone: Banknote, texte: "Paiement cash à la livraison" },
  { icone: WhatsAppIcon, texte: "Commande sur WhatsApp" },
];

export function Hero() {
  const reduit = useReducedMotion() ?? false;
  const section = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const progression = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const globeY = useTransform(progression, [0, 1], reduit ? [0, 0] : [0, 160]);
  const globeEchelle = useTransform(progression, [0, 1], reduit ? [1, 1] : [1, 0.86]);
  const globeRotation = useTransform(progression, [0, 1], reduit ? [0, 0] : [0, 40]);
  const texteY = useTransform(progression, [0, 1], reduit ? [0, 0] : [0, -70]);
  const contenuOpacite = useTransform(progression, [0, 0.75], reduit ? [1, 1] : [1, 0]);
  const blobsY = useTransform(progression, [0, 1], reduit ? [0, 0] : [0, 90]);

  const transitionInstant = reduit ? { duration: 0 } : undefined;
  const apparition = creerApparition(reduit);
  const motVariantes = creerMotVariantes(reduit);

  function defilerVersLaSuite() {
    const el = section.current;
    if (!el) return;
    const haut = el.getBoundingClientRect().bottom + window.scrollY - 64;
    window.scrollTo({ top: haut, behavior: reduit ? "auto" : "smooth" });
  }

  return (
    <section
      ref={section}
      aria-labelledby="hero-titre"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-creme pt-24 lg:pt-24"
    >
      {/* ---------- Fond : blobs dégradés ---------- */}
      <motion.div aria-hidden="true" style={{ y: blobsY }} className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-[30%] -top-[10%] h-[70vmax] w-[70vmax] rounded-full opacity-60 lg:-left-[10%]"
          style={{ background: "radial-gradient(circle, rgb(180 138 224 / 0.55) 0%, transparent 62%)" }}
          animate={reduit ? undefined : { x: [0, 40, -20, 0], y: [0, 30, 60, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[35%] top-[15%] h-[65vmax] w-[65vmax] rounded-full opacity-60 lg:-right-[12%]"
          style={{ background: "radial-gradient(circle, rgb(79 195 232 / 0.45) 0%, transparent 62%)" }}
          animate={reduit ? undefined : { x: [0, -50, 10, 0], y: [0, -30, 30, 0], scale: [1, 0.94, 1.06, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[25%] left-[20%] h-[55vmax] w-[55vmax] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, rgb(123 63 179 / 0.28) 0%, transparent 60%)" }}
          animate={reduit ? undefined : { x: [0, 60, -40, 0], scale: [1, 1.1, 1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Trame de points discrète */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgb(36 26 82 / 0.14) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-creme" />
      </motion.div>

      <Container className="relative flex flex-1 flex-col justify-center pb-28 pt-10 sm:pb-32 sm:pt-12 lg:pb-28 lg:pt-6">
        <div className="grid items-center gap-14 sm:gap-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* ---------- Globe ---------- */}
          <motion.div
            style={{ y: globeY, scale: globeEchelle, opacity: contenuOpacite }}
            className="relative mx-auto aspect-square w-[min(58vw,250px)] sm:w-[340px] lg:order-2 lg:w-[min(42vw,520px)]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={transitionInstant ?? { duration: 1.4, ease: EASE }}
              className="relative h-full w-full"
            >
              {/* Aura lumineuse */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-[22%] -z-10 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgb(123 63 179 / 0.55), rgb(79 195 232 / 0.5), rgb(58 45 122 / 0.35), rgb(180 138 224 / 0.55), rgb(123 63 179 / 0.55))",
                  maskImage: "radial-gradient(circle, black 18%, transparent 68%)",
                  WebkitMaskImage: "radial-gradient(circle, black 18%, transparent 68%)",
                }}
                animate={reduit ? undefined : { rotate: 360, scale: [1, 1.08, 1] }}
                transition={{
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
              />

              {/* Anneaux d'orbite */}
              <div
                aria-hidden="true"
                className="absolute -inset-[13%] rounded-full border border-dashed border-nuit/15"
              />
              <div aria-hidden="true" className="absolute -inset-[3%] rounded-full border border-white/70" />

              {/* Globe flottant + rotation lente */}
              <motion.div
                className="absolute inset-0"
                animate={reduit ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div style={{ rotate: globeRotation }} className="h-full w-full">
                  <motion.div
                    className="h-full w-full"
                    animate={reduit ? undefined : { rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                  >
                    <Image
                      src="/brand/globe.webp"
                      alt="Globe Jazzy World Business : le monde à portée de main"
                      width={600}
                      height={600}
                      priority
                      sizes="(min-width: 1024px) 520px, (min-width: 640px) 340px, 62vw"
                      className="h-full w-full select-none object-contain drop-shadow-[0_30px_45px_rgba(36,26,82,0.28)]"
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
                {/* Reflet */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[6%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.45) 0%, transparent 38%)",
                  }}
                />
              </motion.div>

              {/* Bulles produits en orbite (décoratives) */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-[13%]"
                animate={reduit ? undefined : { rotate: 360 }}
                transition={{ duration: DUREE_ORBITE, repeat: Infinity, ease: "linear" }}
              >
                {ORBITE.map((b, i) => {
                  const rad = (b.angle * Math.PI) / 180;
                  const gauche = 50 + 50 * Math.cos(rad);
                  const haut = 50 + 50 * Math.sin(rad);
                  return (
                    <div
                      key={b.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${gauche}%`, top: `${haut}%` }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={
                          transitionInstant ?? {
                            delay: 0.9 + i * 0.12,
                            type: "spring",
                            stiffness: 260,
                            damping: 18,
                          }
                        }
                      >
                        {/* Contre-rotation : la photo reste droite */}
                        <motion.div
                          animate={reduit ? undefined : { rotate: -360 }}
                          transition={{ duration: DUREE_ORBITE, repeat: Infinity, ease: "linear" }}
                        >
                          <motion.div
                            animate={reduit ? undefined : { y: [0, i % 2 ? 6 : -6, 0] }}
                            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative size-12 overflow-hidden rounded-full bg-white p-0.5 shadow-lg shadow-nuit/20 ring-2 ring-white sm:size-16 lg:size-[4.5rem]"
                          >
                            <Image
                              src={b.image}
                              alt=""
                              width={96}
                              height={96}
                              sizes="72px"
                              className="h-full w-full rounded-full object-cover"
                              draggable={false}
                            />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Carte flottante prix livraison (desktop) */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={transitionInstant ?? { delay: 1.5, duration: 0.8, ease: EASE }}
                className="verre absolute -bottom-[6%] -left-[14%] z-20 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-xl shadow-nuit/10 ring-1 ring-white/80 lg:flex"
              >
                <span className="degrade-marque grid size-10 place-items-center rounded-xl text-white">
                  <Sparkles className="size-5" aria-hidden="true" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-xs font-medium text-nuit/60">Livraison dès</span>
                  <span className="block font-display text-base font-bold text-nuit">
                    {formatFC(boutique.livraison.prixMinFC)}
                  </span>
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ---------- Texte ---------- */}
          <motion.div
            style={{ y: texteY, opacity: contenuOpacite }}
            initial="cache"
            animate="visible"
            className="relative text-center lg:order-1 lg:text-left"
          >
            <motion.p
              variants={apparition}
              custom={0}
              className="verre mx-auto mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-nuit-700 shadow-sm ring-1 ring-violet/15 lg:mx-0"
            >
              <span className="relative flex size-2">
                {!reduit && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-75" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-whatsapp" />
              </span>
              Le monde à portée de main
            </motion.p>

            <motion.h1
              id="hero-titre"
              variants={reduit ? conteneurTitreReduit : conteneurTitre}
              aria-label={TITRE.map((m) => m.texte).join(" ")}
              className="font-display text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-nuit sm:text-6xl lg:text-[4.4rem] xl:text-[5rem]"
            >
              {TITRE.map((mot, i) => (
                <span key={i} aria-hidden="true">
                  <motion.span
                    variants={motVariantes}
                    className={
                      mot.degrade
                        ? "texte-degrade inline-block pb-[0.08em] will-change-transform"
                        : "inline-block will-change-transform"
                    }
                  >
                    {mot.texte}
                  </motion.span>
                  {i < TITRE.length - 1 ? " " : ""}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={apparition}
              custom={0.85}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-nuit/70 sm:text-lg lg:mx-0"
            >
              Montres, lunettes, soins et appareils bien-être sélectionnés pour vous.{" "}
              <strong className="font-semibold text-nuit">Vous payez cash à la livraison</strong>, après
              avoir vu votre article. Livraison dès {formatFC(boutique.livraison.prixMinFC)}.
            </motion.p>

            <motion.div
              variants={apparition}
              custom={1.05}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <ButtonLink href="/boutique/" className="group min-h-14 w-full px-7 text-lg sm:w-auto">
                Voir la boutique
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </ButtonLink>
              <ButtonLink
                href={lienWhatsApp(messageQuestion())}
                externe
                variante="whatsapp"
                className="min-h-14 w-full px-7 text-lg sm:w-auto"
              >
                <WhatsAppIcon className="size-5" />
                Écrire sur WhatsApp
              </ButtonLink>
            </motion.div>

            <motion.ul
              variants={{
                cache: {},
                visible: {
                  transition: reduit ? {} : { staggerChildren: 0.1, delayChildren: 1.3 },
                },
              }}
              aria-label="Nos engagements"
              className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start"
            >
              {BADGES.map(({ icone: Icone, texte }) => (
                <motion.li
                  key={texte}
                  variants={{
                    cache: { opacity: 0, y: 14, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={transitionInstant ?? { type: "spring", stiffness: 300, damping: 22 }}
                  className="verre inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8rem] font-medium text-nuit shadow-sm ring-1 ring-nuit/10 sm:text-sm"
                >
                  <Icone className="size-4 shrink-0 text-violet" aria-hidden="true" />
                  {texte}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </Container>

      {/* ---------- Indicateur de défilement ---------- */}
      <motion.button
        type="button"
        onClick={defilerVersLaSuite}
        aria-label="Faire défiler vers la suite"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitionInstant ?? { delay: 2, duration: 0.8, ease: EASE }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 rounded-full p-2 text-nuit/60 transition-colors hover:text-nuit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet sm:flex"
      >
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]">Découvrir</span>
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-current pt-1.5">
          <motion.span
            className="block h-2 w-1 rounded-full bg-current"
            animate={reduit ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
      <motion.button
        type="button"
        onClick={defilerVersLaSuite}
        aria-label="Faire défiler vers la suite"
        initial={{ opacity: 0 }}
        animate={reduit ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={
          reduit
            ? { duration: 0 }
            : { opacity: { delay: 2, duration: 0.6 }, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }
        }
        className="absolute bottom-3 left-1/2 -ml-6 grid size-12 place-items-center rounded-full text-nuit/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet sm:hidden"
      >
        <ChevronDown className="size-6" aria-hidden="true" />
      </motion.button>
    </section>
  );
}
