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
const INCLINAISON_MAX = 7; // degrés

export function ProductCard({ produit, index = 0 }: { produit: Produit; index?: number }) {
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
  const reflet = useMotionTemplate`radial-gradient(420px circle at ${refletX}% ${refletY}%, rgba(255,255,255,0.35), transparent 45%)`;

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

  return (
    <motion.div
      className="h-full [perspective:1000px]"
      initial={reduire ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: (index % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        onPointerMove={suivrePointeur}
        onPointerLeave={reinitialiser}
        style={reduire ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={clsx(
          "group relative flex h-full flex-col rounded-[var(--radius-carte)] bg-white",
          "shadow-[0_1px_2px_rgba(36,26,82,0.06),0_8px_24px_-12px_rgba(36,26,82,0.18)] ring-1 ring-nuit/5",
          "transition-shadow duration-500 hover:shadow-[0_2px_4px_rgba(36,26,82,0.06),0_28px_50px_-20px_rgba(123,63,179,0.35)]",
          "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-violet",
        )}
      >
        {/* Visuel */}
        <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-carte)] bg-gradient-to-br from-creme via-white to-ciel-200/40">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 size-40 rounded-full bg-violet-300/25 blur-3xl transition-transform duration-700 group-hover:scale-125"
          />
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

          {/* Reflet suivant le pointeur (desktop) */}
          {!reduire && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
              style={{ backgroundImage: reflet }}
            />
          )}

          {categorie && (
            <span className="verre absolute left-2.5 top-2.5 z-[1] max-w-[calc(100%-1.25rem)] truncate rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide text-nuit ring-1 ring-white/60 sm:left-3 sm:top-3 sm:text-xs">
              {categorie.nom}
            </span>
          )}
          {!produit.enStock && (
            <span className="absolute bottom-2.5 left-2.5 z-[1] rounded-full bg-nuit/85 px-2.5 py-1 text-[11px] font-semibold text-white sm:text-xs">
              Bientôt de retour
            </span>
          )}
        </div>

        {/* Texte */}
        <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-5" style={{ transform: "translateZ(20px)" }}>
          <h3 className="font-display text-[15px] font-semibold leading-snug text-nuit sm:text-lg">
            {/* Le lien couvre toute la carte ; le bouton d'ajout reste au-dessus (z-10). */}
            <Link
              href={lien}
              className="outline-none after:absolute after:inset-0 after:z-[2] after:rounded-[var(--radius-carte)] after:content-['']"
            >
              <span className="line-clamp-2 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
                {produit.nom}
              </span>
            </Link>
          </h3>
          {accroche ? (
            <p className="line-clamp-2 text-xs leading-relaxed text-nuit/60 sm:text-sm">{accroche}</p>
          ) : null}

          <div className="mt-auto flex flex-col gap-2.5 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="font-display text-xl font-bold tracking-tight text-nuit sm:text-2xl">
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
