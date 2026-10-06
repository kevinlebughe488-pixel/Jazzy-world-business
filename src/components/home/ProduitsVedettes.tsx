"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { produits, produitsVedettes, type Produit } from "@/lib/catalogue";
import { useMonte } from "@/lib/useMonte";
import { ProductCard } from "@/components/product/ProductCard";
import { useInclinaisonVitesse } from "@/components/animations/Energie";
import { useProgression } from "@/components/animations/useProgression";

/** Largeur d'une carte : limitée par la hauteur d'écran pour toujours tenir en entier. */
const LARGEUR_CARTE = "w-[min(70vw,44svh)] sm:w-[min(42vw,46svh)] lg:w-[min(23vw,42svh)]";

/**
 * Vitrine des produits phares : la section se fige et le défilement vertical
 * fait glisser les produits horizontalement (ils s'inclinent avec la vitesse).
 * Sans JavaScript ou avec « réduire les animations » : simple rangée qui défile au doigt.
 */
export function ProduitsVedettes() {
  const selection = produitsVedettes.length > 0 ? produitsVedettes : produits.slice(0, 4);
  const section = useRef<HTMLElement>(null);
  const piste = useRef<HTMLUListElement>(null);
  const reduit = useReducedMotion();
  const monte = useMonte();
  const [distance, setDistance] = useState(0);
  const distanceMv = useMotionValue(0);
  const horizontal = monte && !reduit && distance > 0;

  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    const mesurer = () => {
      const d = Math.max(0, Math.round(el.offsetWidth - window.innerWidth));
      setDistance(d);
      distanceMv.set(d);
    };
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    window.addEventListener("resize", mesurer);
    return () => {
      observateur.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, [distanceMv]);

  const p = useProgression(section);
  const x = useTransform([p, distanceMv], ([v, d]: number[]) => -v * d);
  const fondX = useTransform(p, [0, 1], ["5%", "-45%"]);
  const barre = useTransform(p, [0, 1], [0, 1]);
  const inclinaison = useInclinaisonVitesse(7);

  return (
    <section
      ref={section}
      id="produits-phares"
      aria-labelledby="titre-produits-phares"
      className="relative bg-white"
      style={horizontal ? { height: `calc(${distance}px + 100svh)` } : undefined}
    >
      <div
        className={
          horizontal
            ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-8"
            : "relative overflow-hidden py-20 sm:py-28"
        }
      >
        {/* Titre géant en fond, qui glisse plus lentement */}
        <motion.p
          aria-hidden="true"
          style={horizontal ? { x: fondX } : undefined}
          className="texte-contour pointer-events-none absolute bottom-[3%] left-0 select-none whitespace-nowrap font-affiche text-[30vw] uppercase leading-none opacity-[0.12] [-webkit-text-stroke-width:2px] lg:text-[22vw]"
        >
          Produits phares · Produits phares
        </motion.p>

        <div className="relative mx-auto mb-6 flex w-full max-w-7xl items-end justify-between gap-6 px-4 sm:mb-10 sm:px-6 lg:px-8">
          <div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500">— Sélection du moment</p>
            <h2
              id="titre-produits-phares"
              className="mt-3 font-affiche text-[17vw] uppercase leading-[0.88] tracking-[0.01em] sm:text-8xl lg:text-9xl"
            >
              Produits <br className="sm:hidden" />
              <span className="texte-contour [-webkit-text-stroke-width:2px]">phares</span>
            </h2>
          </div>
          <div className="hidden shrink-0 pb-2 text-right sm:block">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.3em] text-gris-500">
              {horizontal ? "Continuez à défiler" : "Glissez pour voir"}
            </p>
            <div className="ml-auto mt-3 h-[2px] w-40 bg-gris-200">
              <motion.div style={{ scaleX: horizontal ? barre : 1 }} className="h-full origin-left bg-noir" />
            </div>
          </div>
        </div>

        <div className={horizontal ? "relative" : "relative snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}>
          <motion.ul
            ref={piste}
            style={horizontal ? { x } : undefined}
            className="flex w-max gap-3 px-4 sm:gap-5 sm:px-6 lg:gap-7 lg:px-8"
          >
            {selection.map((produit, i) => (
              <CarteGlissante key={produit.id} produit={produit} index={i} inclinaison={inclinaison} />
            ))}
            <li className={`${LARGEUR_CARTE} shrink-0 snap-start`}>
              <Link
                href="/boutique/"
                className="group flex aspect-square h-auto w-full flex-col justify-between bg-noir p-5 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir sm:p-7"
              >
                <span className="text-[0.66rem] font-bold uppercase tracking-[0.3em] text-white/60">
                  {produits.length} produits
                </span>
                <span className="font-affiche text-[12vw] uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
                  Toute la
                  <br />
                  boutique
                </span>
                <span className="inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.2em]">
                  Découvrir
                  <span className="grid size-11 place-items-center bg-white text-noir transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-x-2">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function CarteGlissante({
  produit,
  index,
  inclinaison,
}: {
  produit: Produit;
  index: number;
  inclinaison: MotionValue<number>;
}) {
  return (
    <motion.li style={{ skewX: inclinaison }} className={`${LARGEUR_CARTE} shrink-0 snap-start origin-bottom`}>
      <ProductCard produit={produit} index={index} />
    </motion.li>
  );
}
