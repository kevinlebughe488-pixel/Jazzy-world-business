"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useSyncExternalStore, type SyntheticEvent } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowRight, ShoppingBag, Truck, Wallet, X } from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { detaillerLignes, usePanier } from "@/lib/cart";
import { formatFC, formatUSD } from "@/lib/format";
import { lienWhatsApp, messageCommande } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CartDrawerLine } from "./CartDrawerLine";

const abonnementVide = () => () => {};
function useMonte() {
  return useSyncExternalStore(
    abonnementVide,
    () => true,
    () => false,
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

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

  // Empêche le défilement fluide global (Lenis, écouteur sur window) de capter la molette/le toucher
  const arreterPropagation = (e: SyntheticEvent) => e.stopPropagation();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="tiroir-panier"
          className="fixed inset-0 z-[70]"
          onWheel={arreterPropagation}
          onTouchMove={arreterPropagation}
          data-lenis-prevent
        >
          {/* Fond flouté */}
          <motion.div
            aria-hidden="true"
            onClick={fermerTiroir}
            className="absolute inset-0 bg-noir/45 backdrop-blur-sm"
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
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-hidden bg-white sm:max-w-md"
            initial={reduire ? { opacity: 0 } : { x: "100%" }}
            animate={reduire ? { opacity: 1 } : { x: 0 }}
            exit={
              reduire
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { x: "100%", transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }
            }
            transition={reduire ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 36, mass: 0.9 }}
          >
            {/* En-tête */}
            <header className="relative flex items-center justify-between gap-3 border-b border-gris-200 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="bg-noir grid size-11 place-items-center text-white">
                  <ShoppingBag className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="titre-tiroir-panier" className="font-affiche text-2xl uppercase tracking-[0.02em] text-noir">
                    Mon panier
                  </h2>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-gris-500" aria-live="polite">
                    {vide ? "Aucun article" : `${articles} article${articles > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
              <motion.button
                ref={fermerRef}
                type="button"
                onClick={fermerTiroir}
                whileHover={reduire ? undefined : { rotate: 90 }}
                whileTap={{ scale: 0.88 }}
                aria-label="Fermer le panier"
                className="grid size-12 place-items-center bg-white text-noir ring-1 ring-gris-200 transition-colors hover:bg-noir hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
              >
                <X className="size-5" aria-hidden="true" />
              </motion.button>
            </header>

            {vide ? (
              <EtatVide surFermer={fermerTiroir} reduire={!!reduire} />
            ) : (
              <>
                {/* Lignes */}
                <div className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5" data-lenis-prevent>
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
                  className="relative border-t border-gris-200 bg-white/80 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6"
                  initial={reduire ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduire ? 0 : 0.2, duration: 0.5, ease: EASE }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-noir">Sous-total</span>
                    <span className="text-2xl font-extrabold text-noir">
                      <MontantAnime valeur={total} />
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 bg-gris-50 px-3.5 py-3 text-[13px] leading-snug text-noir/75">
                    <li className="flex items-start gap-2">
                      <Truck className="mt-px size-4 shrink-0 text-noir" aria-hidden="true" />
                      <span>
                        Livraison à partir de{" "}
                        <strong className="font-semibold text-noir">{formatFC(boutique.livraison.prixMinFC)}</strong>,
                        confirmée sur WhatsApp
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Wallet className="mt-px size-4 shrink-0 text-noir" aria-hidden="true" />
                      <span>Paiement cash à la livraison</span>
                    </li>
                  </ul>

                  <div className="mt-4 flex flex-col gap-2.5">
                    <motion.div whileHover={reduire ? undefined : { scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/panier/"
                        onClick={fermerTiroir}
                        className="group flex min-h-14 w-full items-center justify-center gap-2 bg-noir px-6 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-gris-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
                      >
                        Finaliser ma commande
                        <ArrowRight
                          className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.div>
                    <motion.a
                      href={lienCommande}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={reduire ? undefined : { scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex min-h-13 w-full items-center justify-center gap-2 bg-white px-6 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-noir ring-1 ring-inset ring-noir transition-colors hover:bg-noir hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
                    >
                      <WhatsAppIcon className="size-5" />
                      Commander sur WhatsApp
                    </motion.a>
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
      className="relative flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center"
      initial="cache"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduire ? 0 : 0.08, delayChildren: reduire ? 0 : 0.15 } } }}
    >
      <motion.div
        variants={{
          cache: reduire ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
        }}
        className="relative mb-8"
      >
        <motion.div
          animate={reduire ? undefined : { y: [0, -8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-32 place-items-center bg-noir text-white"
        >
          <ShoppingBag className="size-12" strokeWidth={1.4} aria-hidden="true" />
        </motion.div>
      </motion.div>

      <motion.h3
        variants={{
          cache: reduire ? { opacity: 0 } : { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        className="font-affiche text-3xl uppercase tracking-[0.02em] text-noir"
      >
        Votre panier est vide
      </motion.h3>
      <motion.p
        variants={{
          cache: reduire ? { opacity: 0 } : { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        className="mt-2 max-w-xs text-[15px] leading-relaxed text-noir/65"
      >
        Parcourez nos trouvailles et ajoutez vos coups de cœur. Livraison partout à Kinshasa.
      </motion.p>
      <motion.div
        variants={{
          cache: reduire ? { opacity: 0 } : { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        whileHover={reduire ? undefined : { scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-7"
      >
        <Link
          href="/boutique/"
          onClick={surFermer}
          className="bg-noir group inline-flex min-h-14 items-center gap-2 px-7 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
        >
          Découvrir la boutique
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
