"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useProgression } from "@/components/animations/useProgression";
import { boutique, getProduit } from "@/lib/catalogue";
import { formatUSD } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

/* ---------- Photos produits disposées autour du titre ---------- */

type Vignette = {
  id: string;
  /** Position et taille (mobile → bureau) */
  classe: string;
  rotation: number;
  /** Direction de l'« explosion » au défilement (x, y) */
  vers: [number, number];
  /** Sensibilité au mouvement de la souris */
  profondeur: number;
};

const VIGNETTES: Vignette[] = [
  {
    id: "montre-arabe",
    classe: "left-[-6%] top-[15%] w-[29vw] sm:left-[3%] sm:top-[17%] sm:w-[19vw] lg:left-[5%] lg:w-[13vw]",
    rotation: -8,
    vers: [-1, -0.8],
    profondeur: 1.2,
  },
  {
    id: "lunettes-chromees",
    classe: "right-[-6%] top-[18%] w-[28vw] sm:right-[3%] sm:top-[14%] sm:w-[18vw] lg:right-[6%] lg:w-[12.5vw]",
    rotation: 7,
    vers: [1, -0.9],
    profondeur: 1,
  },
  {
    id: "sac-de-voyage",
    classe: "left-[-4%] bottom-[4%] w-[29vw] sm:left-[7%] sm:bottom-[7%] sm:w-[17vw] lg:left-[11%] lg:w-[12vw]",
    rotation: 6,
    vers: [-1.1, 0.9],
    profondeur: 0.8,
  },
  {
    id: "blanchiment-des-dents",
    classe: "right-[-5%] bottom-[6%] w-[27vw] sm:right-[8%] sm:bottom-[5%] sm:w-[17vw] lg:right-[12%] lg:w-[12.5vw]",
    rotation: -6,
    vers: [1.1, 1],
    profondeur: 1.1,
  },
  {
    id: "tensiometre",
    classe: "hidden lg:block lg:left-[18%] lg:top-[47%] lg:w-[8vw]",
    rotation: 4,
    vers: [-1.5, 0.15],
    profondeur: 1.7,
  },
  {
    id: "stimulateur-fessier",
    classe: "hidden lg:block lg:right-[21%] lg:top-[24%] lg:w-[8vw]",
    rotation: -5,
    vers: [1.5, 0.1],
    profondeur: 1.6,
  },
];

const varCss = (vars: Record<string, string>) => vars as CSSProperties;

export function Hero() {
  const reduit = useReducedMotion() ?? false;
  const section = useRef<HTMLElement>(null);
  const p = useProgression(section);

  // Souris (bureau) : léger relief des photos.
  const sourisX = useMotionValue(0);
  const sourisY = useMotionValue(0);
  const sx = useSpring(sourisX, { stiffness: 70, damping: 18 });
  const sy = useSpring(sourisY, { stiffness: 70, damping: 18 });

  function bougerSouris(e: PointerEvent<HTMLElement>) {
    if (reduit || e.pointerType !== "mouse") return;
    sourisX.set(e.clientX / window.innerWidth - 0.5);
    sourisY.set(e.clientY / window.innerHeight - 0.5);
  }

  // Le titre se déchire en deux, le texte s'efface, puis un cercle noir envahit l'écran.
  const gaucheX = useTransform(p, [0, 0.6], ["0vw", "-62vw"]);
  const droiteX = useTransform(p, [0, 0.6], ["0vw", "62vw"]);
  const titreEchelle = useTransform(p, [0, 0.6], [1, 1.35]);
  const infosOpacite = useTransform(p, [0, 0.2], [1, 0]);
  const infosY = useTransform(p, [0, 0.2], [0, -70]);
  const indiceOpacite = useTransform(p, [0, 0.08], [1, 0]);
  const rideau = useTransform(p, [0.42, 0.9], ["circle(0% at 50% 55%)", "circle(75% at 50% 55%)"]);
  const finEchelle = useTransform(p, [0.45, 1], [1.6, 1]);
  const finOpacite = useTransform(p, [0.55, 0.8], [0, 1]);
  const finLigne = useTransform(p, [0.7, 0.95], [0, 1]);

  return (
    <section
      ref={section}
      aria-labelledby="hero-titre"
      onPointerMove={bougerSouris}
      className="relative h-[240svh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-white motion-reduce:relative">
        {/* ---------- Photos ---------- */}
        <div className="absolute inset-0">
          {VIGNETTES.map((v, i) => (
            <PhotoVolante key={v.id} vignette={v} index={i} p={p} sx={sx} sy={sy} />
          ))}
        </div>

        {/* ---------- Texte ---------- */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-4 pt-[5.5rem] text-center">
          <motion.p style={{ opacity: infosOpacite, y: infosY }} className="overflow-hidden">
            <span
              className="entree-fondu block text-[0.66rem] font-bold uppercase tracking-[0.38em] text-noir sm:text-xs"
              style={varCss({ "--d": "0.05s" })}
            >
              Boutique en ligne · Kinshasa
            </span>
          </motion.p>

          <h1
            id="hero-titre"
            className="mt-3 font-affiche text-[length:min(31vw,24svh)] uppercase leading-[0.86] tracking-[0.01em] text-noir sm:mt-4"
          >
            <span className="sr-only">{boutique.nom} : le bien-être et le style, livrés partout à Kinshasa</span>
            <motion.span aria-hidden="true" className="block" style={{ x: gaucheX, scale: titreEchelle }}>
              <span className="block overflow-hidden">
                <span className="entree block" style={varCss({ "--d": "0.12s" })}>
                  Jazzy
                </span>
              </span>
            </motion.span>
            <motion.span aria-hidden="true" className="block" style={{ x: droiteX, scale: titreEchelle }}>
              <span className="block overflow-hidden">
                <span
                  className="entree texte-contour block [-webkit-text-stroke-width:2px] lg:[-webkit-text-stroke-width:3px]"
                  style={varCss({ "--d": "0.26s" })}
                >
                  World
                </span>
              </span>
            </motion.span>
          </h1>

          <motion.div style={{ opacity: infosOpacite, y: infosY }} className="pointer-events-auto mt-5 flex w-full flex-col items-center sm:mt-7">
            <p
              className="entree-fondu max-w-[19rem] text-sm leading-relaxed text-gris-700 sm:max-w-md sm:text-base"
              style={varCss({ "--d": "0.45s" })}
            >
              Montres, lunettes, soins et bien-être sélectionnés pour vous.{" "}
              <strong className="font-semibold text-noir">Payez cash à la livraison.</strong>
            </p>
            <div
              className="entree-fondu mt-6 flex w-full max-w-[19rem] flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:gap-3"
              style={varCss({ "--d": "0.6s" })}
            >
              <ButtonLink href="/boutique/" className="group">
                Voir la boutique
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={lienWhatsApp(messageQuestion())} externe variante="secondaire">
                <WhatsAppIcon className="size-4" />
                Écrire sur WhatsApp
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* ---------- Indice de défilement (bureau) ---------- */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: indiceOpacite }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
        >
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.4em]">Défiler</span>
          <span className="relative block h-12 w-px overflow-hidden bg-gris-200">
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-noir"
              animate={reduit ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </motion.div>

        {/* ---------- Cercle noir qui envahit l'écran ---------- */}
        <motion.div
          aria-hidden="true"
          style={{ clipPath: rideau }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-noir px-4 pt-[5.5rem] text-center text-white motion-reduce:hidden"
        >
          <motion.div style={{ scale: finEchelle, opacity: finOpacite }}>
            <p className="font-affiche text-[length:min(20vw,15svh)] uppercase leading-[0.88] tracking-[0.01em]">
              Le style,
              <br />
              <span className="texte-contour-blanc [-webkit-text-stroke-width:2px]">livré</span>
              <br />
              chez vous.
            </p>
            <motion.span style={{ scaleX: finLigne }} className="mx-auto mt-6 block h-px w-40 origin-left bg-white sm:w-64" />
            <p className="mt-5 text-[0.66rem] font-bold uppercase tracking-[0.38em] text-white/70 sm:text-xs">
              Partout à Kinshasa · Cash à la livraison
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PhotoVolante({
  vignette,
  index,
  p,
  sx,
  sy,
}: {
  vignette: Vignette;
  index: number;
  p: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const produit = getProduit(vignette.id);
  const [vx, vy] = vignette.vers;
  const x = useTransform(p, [0, 0.65], ["0vw", `${vx * 48}vw`]);
  const y = useTransform(p, [0, 0.65], ["0svh", `${vy * 42}svh`]);
  const echelle = useTransform(p, [0, 0.65], [1, 1.7]);
  const rotation = useTransform(p, [0, 0.65], [vignette.rotation, vignette.rotation * 3.2]);
  const px = useTransform(sx, (v) => v * 46 * vignette.profondeur);
  const py = useTransform(sy, (v) => v * 46 * vignette.profondeur);

  if (!produit?.images[0]) return null;

  return (
    <motion.div className={clsx("absolute", vignette.classe)} style={{ x, y, scale: echelle, rotate: rotation }}>
      <motion.div style={{ x: px, y: py }}>
        <div
          className="entree-zoom"
          style={varCss({ "--d": `${(0.2 + index * 0.08).toFixed(2)}s`, "--r": `${vignette.rotation * 2}deg` })}
        >
          <Link
            href={`/produits/${produit.id}/`}
            className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir"
            aria-label={`${produit.nom}, ${formatUSD(produit.prix)}`}
          >
            <span className="relative block aspect-[3/4] overflow-hidden bg-gris-100 shadow-[0_30px_50px_-28px_rgba(0,0,0,0.55)]">
              <Image
                src={produit.images[0]}
                alt=""
                fill
                priority={index < 4}
                sizes="(min-width: 1024px) 13vw, (min-width: 640px) 19vw, 30vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-doux)] group-hover:scale-110"
                draggable={false}
              />
            </span>
            <span className="mt-1.5 flex items-baseline justify-between gap-2 text-left text-[0.55rem] font-bold uppercase tracking-[0.14em] text-noir sm:text-[0.62rem]">
              <span className="truncate">{produit.nom}</span>
              <span className="shrink-0">{formatUSD(produit.prix)}</span>
            </span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
