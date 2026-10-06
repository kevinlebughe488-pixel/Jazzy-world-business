"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
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

const DUREE_VOL = 0.85;
const DUREE_SUCCES = 1700;
const COULEURS_ETINCELLES = ["#1d6fe0", "#4fc3e8", "#8fbaf3", "#25d366", "#f5c542"];

/** Photo du produit qui suit une courbe jusqu'à l'icône du panier (rendue dans un portail). */
function ImageVolante({ vol, onFin }: { vol: Vol; onFin: (cle: number) => void }) {
  const { depart, arrivee, taille } = vol;
  // Point de contrôle : on monte au-dessus des deux points pour dessiner un arc.
  const sommetY = Math.min(depart.y, arrivee.y) - Math.max(80, Math.abs(depart.x - arrivee.x) * 0.25);
  const milieuX = depart.x + (arrivee.x - depart.x) * 0.45;
  const demi = taille / 2;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-bleu/40 ring-2 ring-white"
      style={{ width: taille, height: taille, willChange: "transform, opacity" }}
      initial={{ x: depart.x - demi, y: depart.y - demi, scale: 0.4, opacity: 0, rotate: 0 }}
      animate={{
        x: [depart.x - demi, milieuX - demi, arrivee.x - demi],
        y: [depart.y - demi, sommetY - demi, arrivee.y - demi],
        scale: [0.4, 1.05, 0.18],
        opacity: [0, 1, 0.15],
        rotate: [0, -8, 12],
      }}
      transition={{ duration: DUREE_VOL, times: [0, 0.4, 1], ease: [0.45, 0, 0.2, 1] }}
      onAnimationComplete={() => onFin(vol.cle)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={vol.image} alt="" className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  );
}

/** Petite gerbe d'étincelles autour du bouton. */
function Etincelles({ cle }: { cle: number }) {
  const particules = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 + (cle % 7) * 0.3;
    const distance = 26 + (i % 3) * 10;
    return {
      i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      couleur: COULEURS_ETINCELLES[i % COULEURS_ETINCELLES.length],
      rond: i % 2 === 0,
    };
  });
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particules.map((p) => (
        <motion.span
          key={`${cle}-${p.i}`}
          className={clsx("absolute block", p.rond ? "size-1.5 rounded-full" : "h-2 w-1 rounded-sm")}
          style={{ backgroundColor: p.couleur }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.3, 0], opacity: [1, 1, 0], rotate: p.rond ? 0 : 180 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </span>
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
  /** Image à faire voler vers le panier (src de la photo produit). */
  image?: string;
  className?: string;
  compact?: boolean;
}) {
  const ajouter = usePanier((s) => s.ajouter);
  const reduire = useReducedMotion();
  const boutonRef = useRef<HTMLButtonElement>(null);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ajoute, setAjoute] = useState(false);
  const [rafale, setRafale] = useState(0);
  const [vols, setVols] = useState<Vol[]>([]);

  useEffect(
    () => () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    },
    [],
  );

  const finVol = useCallback((cle: number) => {
    setVols((v) => v.filter((x) => x.cle !== cle));
    const icone = document.getElementById("icone-panier");
    icone?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25) rotate(-8deg)" }, { transform: "scale(1)" }],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, []);

  function lancerVol() {
    if (reduire || !image || !boutonRef.current) return;
    const icone = document.getElementById("icone-panier");
    if (!icone) return;
    const cible = icone.getBoundingClientRect();
    if (cible.width === 0 && cible.height === 0) return;
    const source = boutonRef.current.getBoundingClientRect();
    const taille = compact ? 96 : 120;
    setVols((v) => [
      ...v,
      {
        cle: Date.now() + Math.random(),
        image,
        taille,
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
    if (!reduire) setRafale((r) => r + 1);
    setAjoute(true);
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => setAjoute(false), DUREE_SUCCES);
  }

  const icone = (
    <span className={clsx("relative inline-flex shrink-0 items-center justify-center", compact ? "size-4" : "size-5")}>
      <AnimatePresence initial={false} mode="popLayout">
        {ajoute ? (
          <motion.span
            key="ok"
            className="absolute inset-0 flex items-center justify-center"
            initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.3, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.3, rotate: 90 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
          >
            <Check className="size-full" strokeWidth={3} aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="sac"
            className="absolute inset-0 flex items-center justify-center"
            initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.3, rotate: 90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.3, rotate: -90 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
          >
            <ShoppingBag className="size-full" strokeWidth={2.2} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );

  const libelleRepos = compact ? "Ajouter" : "Ajouter au panier";
  const libelleOk = compact ? "Ajouté" : "Ajouté au panier";

  return (
    <>
      <motion.button
        ref={boutonRef}
        type="button"
        onClick={auClic}
        whileHover={reduire ? undefined : { scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        aria-label={compact ? "Ajouter au panier" : undefined}
        className={clsx(
          "relative isolate inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold text-white transition-[background-color,box-shadow] duration-300",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu",
          compact ? "min-h-11 px-4 text-sm" : "min-h-14 px-7 text-base",
          ajoute
            ? "bg-emerald-600 shadow-lg shadow-emerald-600/30"
            : "degrade-marque shadow-lg shadow-bleu/25 hover:shadow-bleu/45",
          className,
        )}
      >
        {rafale > 0 && <Etincelles key={rafale} cle={rafale} />}
        {icone}
        <span className="relative grid">
          {/* Les deux libellés occupent la même cellule : la largeur du bouton ne saute pas. */}
          <span className={clsx("col-start-1 row-start-1 transition-opacity duration-200", ajoute && "opacity-0")}>
            {libelleRepos}
          </span>
          <span
            aria-hidden
            className={clsx("col-start-1 row-start-1 transition-opacity duration-200", !ajoute && "opacity-0")}
          >
            {libelleOk}
          </span>
        </span>
      </motion.button>
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
