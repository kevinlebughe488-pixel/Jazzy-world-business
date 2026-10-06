"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";
import { getCategorie, type Produit } from "@/lib/catalogue";
import { formatUSD } from "@/lib/format";
import { AddToCartButton } from "@/components/product/AddToCartButton";

const RESSORT = { stiffness: 220, damping: 20, mass: 0.6 };
const INCLINAISON_MAX = 6; // degrés

export function ProductCard({
  produit,
  index = 0,
  entree = true,
  className,
}: {
  produit: Produit;
  index?: number;
  /** Animation d'apparition au défilement (désactivée quand le parent anime déjà la carte). */
  entree?: boolean;
  className?: string;
}) {
  const reduire = useReducedMotion();
  const categorie = getCategorie(produit.categorie);
  const [image1, image2] = produit.images;
  const lien = `/produits/${produit.id}/`;
  const accroche = produit.accroche?.trim();

  // Position du pointeur normalisée (-0.5 → 0.5) pour l'inclinaison 3D.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [INCLINAISON_MAX, -INCLINAISON_MAX]), RESSORT);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-INCLINAISON_MAX, INCLINAISON_MAX]), RESSORT);
  // Reflet lumineux qui suit le pointeur.
  const refletX = useTransform(px, [-0.5, 0.5], [0, 100]);
  const refletY = useTransform(py, [-0.5, 0.5], [0, 100]);
  const reflet = useMotionTemplate`radial-gradient(380px circle at ${refletX}% ${refletY}%, rgba(255,255,255,0.32), transparent 45%)`;

  function suivrePointeur(e: PointerEvent<HTMLDivElement>) {
    if (reduire || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function reinitialiser() {
    px.set(0);
    py.set(0);
  }

  const apparition = entree
    ? {
        initial: reduire ? { opacity: 0 } : { opacity: 0, y: 70, scale: 0.92, rotate: index % 2 ? 2 : -2 },
        whileInView: { opacity: 1, y: 0, scale: 1, rotate: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.9, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {};

  return (
    <motion.div className={clsx("h-full [perspective:1000px]", className)} {...apparition}>
      <motion.article
        onPointerMove={suivrePointeur}
        onPointerLeave={reinitialiser}
        style={reduire ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative flex h-full flex-col bg-white has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-noir"
      >
        {/* Visuel */}
        <div className="relative aspect-square overflow-hidden bg-gris-50">
          {image1 && (
            <Image
              src={image1}
              alt={`${produit.nom} - Jazzy World Business`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 50vw"
              className={clsx(
                "object-cover transition-[transform,opacity] duration-700 ease-[var(--ease-doux)]",
                "group-hover:scale-[1.08]",
                image2 && "[@media(hover:hover)]:group-hover:opacity-0",
              )}
            />
          )}
          {image2 && (
            <Image
              src={image2}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 50vw"
              className={clsx(
                "hidden object-cover opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-doux)]",
                "scale-[1.02] group-hover:scale-[1.1] [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:opacity-100",
              )}
            />
          )}

          {/* Reflet suivant le pointeur (bureau) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 motion-reduce:hidden [@media(hover:hover)]:group-hover:opacity-100"
            style={{ backgroundImage: reflet }}
          />

          {categorie && (
            <span className="absolute left-0 top-0 z-[1] max-w-[calc(100%-1rem)] truncate bg-white px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-noir sm:text-[0.62rem]">
              {categorie.nom}
            </span>
          )}
          {!produit.enStock && (
            <span className="absolute bottom-0 left-0 z-[1] bg-noir px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white">
              Bientôt de retour
            </span>
          )}

          {/* Barre « Voir » qui monte au survol (bureau) */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-[1] hidden translate-y-full bg-noir/90 py-2.5 text-center text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-y-0 [@media(hover:hover)]:block"
          >
            Voir le produit
          </span>
        </div>

        {/* Texte */}
        <div className="flex flex-1 flex-col gap-1 pt-3" style={{ transform: "translateZ(20px)" }}>
          <h3 className="text-[0.82rem] font-medium leading-snug text-gris-700 sm:text-sm">
            {/* Le lien couvre toute la carte ; le bouton d'ajout reste au-dessus (z-10). */}
            <Link href={lien} className="outline-none after:absolute after:inset-0 after:z-[2] after:content-['']">
              <span className="line-clamp-2 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {produit.nom}
              </span>
            </Link>
          </h3>
          {accroche ? <p className="line-clamp-1 text-xs text-gris-500">{accroche}</p> : null}

          <div className="mt-auto flex flex-col gap-2.5 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-lg font-extrabold tracking-tight text-noir sm:text-xl">
              <span className="sr-only">Prix : </span>
              {formatUSD(produit.prix)}
            </p>
            {produit.enStock && (
              <div className="relative z-10">
                <AddToCartButton produitId={produit.id} image={image1} compact className="w-full sm:w-auto" />
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
