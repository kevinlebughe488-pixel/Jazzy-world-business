"use client";

import Image from "next/image";
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
            className="absolute inset-0 bg-nuit-900/45 backdrop-blur-sm"
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
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-hidden bg-creme shadow-2xl shadow-nuit-900/40 sm:max-w-md sm:rounded-l-[2rem]"
            initial={reduire ? { opacity: 0 } : { x: "100%" }}
            animate={reduire ? { opacity: 1 } : { x: 0 }}
            exit={
              reduire
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { x: "100%", transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }
            }
            transition={reduire ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 36, mass: 0.9 }}
          >
            {/* Halo décoratif */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-bleu/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-10 -left-24 size-56 rounded-full bg-ciel/15 blur-3xl"
            />

            {/* En-tête */}
            <header className="relative flex items-center justify-between gap-3 border-b border-nuit/8 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="degrade-marque grid size-11 place-items-center rounded-2xl text-white shadow-lg shadow-bleu/25">
                  <ShoppingBag className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="titre-tiroir-panier" className="text-xl font-bold text-nuit">
                    Mon panier
                  </h2>
                  <p className="text-sm text-nuit/60" aria-live="polite">
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
                className="grid size-12 place-items-center rounded-full bg-white text-nuit shadow-sm ring-1 ring-nuit/10 transition-colors hover:bg-nuit hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
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
                  className="relative border-t border-nuit/8 bg-white/80 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6"
                  initial={reduire ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduire ? 0 : 0.2, duration: 0.5, ease: EASE }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-nuit/70">Sous-total</span>
                    <span className="font-display text-2xl font-bold text-nuit">
                      <MontantAnime valeur={total} />
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 rounded-2xl bg-creme px-3.5 py-3 text-[13px] leading-snug text-nuit/75">
                    <li className="flex items-start gap-2">
                      <Truck className="mt-px size-4 shrink-0 text-bleu" aria-hidden="true" />
                      <span>
                        Livraison à partir de{" "}
                        <strong className="font-semibold text-nuit">{formatFC(boutique.livraison.prixMinFC)}</strong>,
                        confirmée sur WhatsApp
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Wallet className="mt-px size-4 shrink-0 text-bleu" aria-hidden="true" />
                      <span>Paiement cash à la livraison</span>
                    </li>
                  </ul>

                  <div className="mt-4 flex flex-col gap-2.5">
                    <motion.div whileHover={reduire ? undefined : { scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/panier/"
                        onClick={fermerTiroir}
                        className="degrade-marque group flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-white shadow-lg shadow-bleu/30 transition-shadow hover:shadow-bleu/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
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
                      className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-whatsapp/10 px-6 text-[15px] font-semibold text-[#0b7a3b] ring-1 ring-whatsapp/40 transition-colors hover:bg-whatsapp hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
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
        <div aria-hidden="true" className="absolute inset-4 rounded-full bg-gradient-to-br from-bleu/30 to-ciel/30 blur-2xl" />
        <motion.div
          animate={reduire ? undefined : { y: [0, -10, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Image
            src="/brand/globe.webp"
            alt=""
            width={600}
            height={600}
            sizes="176px"
            className="size-40 drop-shadow-xl sm:size-44"
          />
        </motion.div>
        <span className="absolute -right-1 bottom-3 grid size-12 place-items-center rounded-full bg-white text-bleu shadow-lg ring-1 ring-nuit/5">
          <ShoppingBag className="size-5" aria-hidden="true" />
        </span>
      </motion.div>

      <motion.h3
        variants={{
          cache: reduire ? { opacity: 0 } : { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        className="text-2xl font-bold text-nuit"
      >
        Votre panier est vide
      </motion.h3>
      <motion.p
        variants={{
          cache: reduire ? { opacity: 0 } : { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        className="mt-2 max-w-xs text-[15px] leading-relaxed text-nuit/65"
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
          className="degrade-marque group inline-flex min-h-14 items-center gap-2 rounded-full px-7 text-base font-semibold text-white shadow-lg shadow-bleu/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
        >
          Découvrir la boutique
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
