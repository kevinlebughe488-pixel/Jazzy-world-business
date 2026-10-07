"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { detaillerLignes, usePanier } from "@/lib/cart";
import { formatFC, formatUSD } from "@/lib/format";
import { useMonte } from "@/lib/useMonte";
import { lienWhatsApp, messageCommande } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CartDrawerLine } from "./CartDrawerLine";

const EASE = [0.16, 1, 0.3, 1] as const;

function MontantAnime({ valeur }: { valeur: number }) {
  const reduire = useReducedMotion();
  const mv = useMotionValue(valeur);
  const texte = useTransform(mv, (v) => formatUSD(Math.round(v * 100) / 100));

  useEffect(() => {
    if (reduire) {
      mv.set(valeur);
      return;
    }
    const controle = animate(mv, valeur, { duration: 0.6, ease: EASE });
    return () => controle.stop();
  }, [valeur, reduire, mv]);

  return <motion.span className="tabular-nums">{texte}</motion.span>;
}

function bloquerDefilement() {
  const html = document.documentElement;
  const largeurBarre = window.innerWidth - html.clientWidth;
  const precedent = { overflow: html.style.overflow, padding: document.body.style.paddingRight };
  html.style.overflow = "hidden";
  if (largeurBarre > 0) document.body.style.paddingRight = `${largeurBarre}px`;
  return () => {
    html.style.overflow = precedent.overflow;
    document.body.style.paddingRight = precedent.padding;
  };
}

const SELECTEUR_FOCUS =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function CartDrawer() {
  const monte = useMonte();
  const ouvert = usePanier((s) => s.tiroirOuvert);
  const lignesBrutes = usePanier((s) => s.lignes);
  const fermerTiroir = usePanier((s) => s.fermerTiroir);
  const reduire = useReducedMotion();
  const pathname = usePathname();

  const panneauRef = useRef<HTMLDivElement>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);
  const focusPrecedent = useRef<HTMLElement | null>(null);

  const lignes = useMemo(() => (monte ? lignesBrutes : []), [monte, lignesBrutes]);
  const details = useMemo(() => detaillerLignes(lignes), [lignes]);
  const total = details.reduce((t, l) => t + l.total, 0);
  const articles = details.reduce((t, l) => t + l.quantite, 0);
  const visible = monte && ouvert;

  // Fermer lors d'un changement de page
  const dernierChemin = useRef(pathname);
  useEffect(() => {
    if (dernierChemin.current !== pathname) {
      dernierChemin.current = pathname;
      fermerTiroir();
    }
  }, [pathname, fermerTiroir]);

  // Blocage du défilement, Échap, piège de focus
  useEffect(() => {
    if (!visible) return;
    focusPrecedent.current = document.activeElement as HTMLElement | null;
    const debloquer = bloquerDefilement();
    const minuterie = window.setTimeout(() => fermerRef.current?.focus({ preventScroll: true }), 40);

    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fermerTiroir();
        return;
      }
      if (e.key !== "Tab" || !panneauRef.current) return;
      const focusables = Array.from(panneauRef.current.querySelectorAll<HTMLElement>(SELECTEUR_FOCUS)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusables.length === 0) return;
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];
      const actif = document.activeElement;
      if (e.shiftKey && (actif === premier || !panneauRef.current.contains(actif))) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && (actif === dernier || !panneauRef.current.contains(actif))) {
        e.preventDefault();
        premier.focus();
      }
    };
    document.addEventListener("keydown", surTouche);

    return () => {
      window.clearTimeout(minuterie);
      document.removeEventListener("keydown", surTouche);
      debloquer();
      const cible = focusPrecedent.current ?? document.getElementById("icone-panier");
      cible?.focus?.({ preventScroll: true });
    };
  }, [visible, fermerTiroir]);

  const lienCommande = lienWhatsApp(messageCommande(lignes));
  const vide = details.length === 0;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div key="tiroir-panier" className="fixed inset-0 z-[70]">
          {/* Voile */}
          <motion.div
            aria-hidden="true"
            onClick={fermerTiroir}
            className="absolute inset-0 bg-encre/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35 }}
          />

          {/* Panneau */}
          <motion.div
            ref={panneauRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-tiroir-panier"
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-hidden bg-papier sm:inset-y-3 sm:right-3 sm:max-w-md sm:rounded-carte sm:shadow-releve"
            initial={reduire ? { opacity: 0 } : { x: "105%" }}
            animate={reduire ? { opacity: 1 } : { x: 0 }}
            exit={
              reduire
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { x: "105%", transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }
            }
            transition={reduire ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 36, mass: 0.9 }}
          >
            {/* En-tête */}
            <header className="flex items-center justify-between gap-3 border-b border-trait px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-5">
              <div>
                <h2 id="titre-tiroir-panier" className="font-serif text-3xl leading-none">
                  Mon panier
                </h2>
                <p className="mt-1.5 text-sm text-muet" aria-live="polite">
                  {vide ? "Aucun article" : `${articles} article${articles > 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                ref={fermerRef}
                type="button"
                onClick={fermerTiroir}
                aria-label="Fermer le panier"
                className="grid size-11 place-items-center rounded-full bg-carte text-encre ring-1 ring-inset ring-trait-fort transition-[box-shadow,transform] hover:ring-encre/40 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </header>

            {vide ? (
              <EtatVide surFermer={fermerTiroir} reduire={!!reduire} />
            ) : (
              <>
                {/* Lignes */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5">
                  <ul className="flex flex-col gap-3" aria-label="Articles du panier">
                    <AnimatePresence initial={true} mode="popLayout">
                      {details.map((ligne, i) => (
                        <CartDrawerLine key={ligne.produit.id} ligne={ligne} index={i} />
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Récapitulatif */}
                <motion.footer
                  className="border-t border-trait bg-carte px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6"
                  initial={reduire ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduire ? 0 : 0.15, duration: 0.45, ease: EASE }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-encre-doux">Sous-total</span>
                    <span className="font-serif text-3xl leading-none">
                      <MontantAnime valeur={total} />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muet">
                    Livraison dès {formatFC(boutique.livraison.prixMinFC)}, confirmée sur WhatsApp. Paiement cash à la
                    livraison.
                  </p>

                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link
                      href="/panier/"
                      onClick={fermerTiroir}
                      className="group/bouton flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-encre pl-6 pr-2 font-medium text-papier transition-[background-color,transform] duration-300 hover:bg-encre-doux active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
                    >
                      <span className="flex-1 text-center">Finaliser ma commande</span>
                      <span
                        aria-hidden="true"
                        className="grid size-9 place-items-center rounded-full bg-ocre text-encre transition-transform duration-300 group-hover/bouton:translate-x-0.5"
                      >
                        <ArrowRight className="size-4" strokeWidth={2.2} />
                      </span>
                    </Link>
                    <a
                      href={lienCommande}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 font-medium text-encre transition-[background-color,transform] duration-300 hover:bg-whatsapp-fonce active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
                    >
                      <WhatsAppIcon className="size-5" />
                      Commander sur WhatsApp
                    </a>
                  </div>
                </motion.footer>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function EtatVide({ surFermer, reduire }: { surFermer: () => void; reduire: boolean }) {
  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center"
      initial={reduire ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduire ? 0 : 0.1, ease: EASE }}
    >
      <span className="grid size-20 place-items-center rounded-full bg-lin text-encre-doux">
        <ShoppingBag className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="mt-7 font-serif text-3xl">Votre panier est vide</h3>
      <p className="mt-2 max-w-xs leading-relaxed text-muet">
        Parcourez la boutique et ajoutez vos coups de cœur. Livraison partout à Kinshasa.
      </p>
      <Link
        href="/boutique/"
        onClick={surFermer}
        className="group/bouton mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-encre pl-6 pr-1.5 font-medium text-papier transition-[background-color,transform] duration-300 hover:bg-encre-doux active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
      >
        Voir la boutique
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full bg-ocre text-encre transition-transform duration-300 group-hover/bouton:translate-x-0.5"
        >
          <ArrowRight className="size-4" strokeWidth={2.2} />
        </span>
      </Link>
    </motion.div>
  );
}
