"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { usePanier } from "@/lib/cart";

type Vol = {
  cle: number;
  image: string;
  depart: { x: number; y: number };
  arrivee: { x: number; y: number };
  taille: number;
};

const DUREE_VOL = 0.7;
const DUREE_SUCCES = 1600;

/** Miniature du produit qui glisse jusqu'à l'icône du panier (rendue dans un portail). */
function ImageVolante({ vol, onFin }: { vol: Vol; onFin: (cle: number) => void }) {
  const { depart, arrivee, taille } = vol;
  const sommetY = Math.min(depart.y, arrivee.y) - 60;
  const milieuX = depart.x + (arrivee.x - depart.x) * 0.5;
  const demi = taille / 2;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] overflow-hidden rounded-xl bg-carte shadow-releve ring-2 ring-carte"
      style={{ width: taille, height: taille, willChange: "transform, opacity" }}
      initial={{ x: depart.x - demi, y: depart.y - demi, scale: 0.6, opacity: 0 }}
      animate={{
        x: [depart.x - demi, milieuX - demi, arrivee.x - demi],
        y: [depart.y - demi, sommetY - demi, arrivee.y - demi],
        scale: [0.6, 0.9, 0.2],
        opacity: [0, 1, 0.2],
      }}
      transition={{ duration: DUREE_VOL, times: [0, 0.45, 1], ease: [0.45, 0, 0.2, 1] }}
      onAnimationComplete={() => onFin(vol.cle)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={vol.image} alt="" className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  );
}

export function AddToCartButton({
  produitId,
  quantite = 1,
  image,
  className,
  compact = false,
}: {
  produitId: string;
  quantite?: number;
  /** Image à faire glisser vers le panier (src de la photo produit). */
  image?: string;
  className?: string;
  /** Bouton rond (icône seule), pour les cartes produits. */
  compact?: boolean;
}) {
  const ajouter = usePanier((s) => s.ajouter);
  const reduire = useReducedMotion();
  const boutonRef = useRef<HTMLButtonElement>(null);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ajoute, setAjoute] = useState(false);
  const [vols, setVols] = useState<Vol[]>([]);

  useEffect(
    () => () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    },
    [],
  );

  const finVol = useCallback((cle: number) => {
    setVols((v) => v.filter((x) => x.cle !== cle));
    document
      .getElementById("icone-panier")
      ?.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], {
        duration: 380,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      });
  }, []);

  function lancerVol() {
    if (reduire || !image || !boutonRef.current) return;
    const icone = document.getElementById("icone-panier");
    if (!icone) return;
    const cible = icone.getBoundingClientRect();
    if (cible.width === 0 && cible.height === 0) return;
    const source = boutonRef.current.getBoundingClientRect();
    setVols((v) => [
      ...v,
      {
        cle: Date.now() + Math.random(),
        image,
        taille: 72,
        depart: { x: source.left + source.width / 2, y: source.top + source.height / 2 },
        arrivee: { x: cible.left + cible.width / 2, y: cible.top + cible.height / 2 },
      },
    ]);
  }

  function auClic(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    ajouter(produitId, quantite);
    lancerVol();
    setAjoute(true);
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => setAjoute(false), DUREE_SUCCES);
  }

  const Icone = ajoute ? Check : compact ? Plus : ShoppingBag;
  const icone = (
    <span className={clsx("relative inline-grid shrink-0 place-items-center", compact ? "size-[1.15rem]" : "size-5")}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={ajoute ? "ok" : "repos"}
          className="absolute inset-0 grid place-items-center"
          initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <Icone className="size-full" strokeWidth={ajoute ? 2.6 : 2} aria-hidden />
        </motion.span>
      </AnimatePresence>
    </span>
  );

  return (
    <>
      <button
        ref={boutonRef}
        type="button"
        onClick={auClic}
        aria-label={compact ? "Ajouter au panier" : undefined}
        title={compact ? "Ajouter au panier" : undefined}
        className={clsx(
          "relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-medium transition-[background-color,color,transform] duration-300 ease-[var(--ease-doux)] active:scale-95",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre",
          compact ? "size-11" : "min-h-14 px-7 text-base",
          ajoute ? "bg-ocre text-encre" : "bg-encre text-papier hover:bg-encre-doux",
          className,
        )}
      >
        {icone}
        {!compact && (
          <span className="grid">
            {/* Les deux libellés occupent la même cellule : la largeur du bouton ne saute pas. */}
            <span className={clsx("col-start-1 row-start-1 transition-opacity duration-200", ajoute && "opacity-0")}>
              Ajouter au panier
            </span>
            <span aria-hidden className={clsx("col-start-1 row-start-1 transition-opacity duration-200", !ajoute && "opacity-0")}>
              Ajouté au panier
            </span>
          </span>
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {ajoute ? "Produit ajouté au panier" : ""}
      </span>
      {vols.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            {vols.map((v) => (
              <ImageVolante key={v.cle} vol={v} onFin={finVol} />
            ))}
          </>,
          document.body,
        )}
    </>
  );
}
