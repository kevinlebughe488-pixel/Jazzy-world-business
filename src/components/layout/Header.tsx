"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { usePanier, nombreArticles } from "@/lib/cart";
import { boutique } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { formatFC } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/boutique/", label: "Boutique" },
  { href: "/infos/", label: "Livraison & infos" },
] as const;

const ANNONCES = [
  `Livraison partout à Kinshasa dès ${formatFC(boutique.livraison.prixMinFC)}`,
  "Paiement cash à la livraison",
  "Commande en un clic sur WhatsApp",
  "Aucun paiement en ligne",
];

const abonnementVide = () => () => {};
function useMonte() {
  return useSyncExternalStore(
    abonnementVide,
    () => true,
    () => false,
  );
}

function normaliser(chemin: string) {
  return chemin.endsWith("/") ? chemin : `${chemin}/`;
}

function estActif(pathname: string, href: string) {
  const p = normaliser(pathname);
  if (href === "/") return p === "/";
  if (href === "/boutique/") return p.startsWith("/boutique/") || p.startsWith("/produits/");
  return p.startsWith(href);
}

const ease = [0.22, 1, 0.36, 1] as const;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir";

/** Bandeau noir d'annonces qui défile en continu (CSS pur, très léger). */
function BandeauAnnonces() {
  const liste = (cache: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={cache || undefined}>
      {[...ANNONCES, ...ANNONCES].map((a, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6">
          <span className="mr-6 size-1 rounded-full bg-white/60" aria-hidden="true" />
          {a}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative h-8 overflow-hidden bg-noir text-[0.68rem] font-semibold uppercase leading-8 tracking-[0.2em] text-white">
      <p className="sr-only">{ANNONCES.join(". ")}.</p>
      <div className="flex w-max motion-safe:animate-defile">
        {liste(true)}
        {liste(true)}
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const reduire = useReducedMotion();
  const monte = useMonte();
  const lignes = usePanier((s) => s.lignes);
  const ouvrirTiroir = usePanier((s) => s.ouvrirTiroir);
  const nombre = monte ? nombreArticles(lignes) : 0;

  const [defile, setDefile] = useState(false);
  const [cache, setCache] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [cheminMenu, setCheminMenu] = useState(pathname);
  const boutonMenu = useRef<HTMLButtonElement>(null);

  // Ferme le menu à chaque changement de page (ajustement pendant le rendu, sans effet).
  if (cheminMenu !== pathname) {
    setCheminMenu(pathname);
    if (menuOuvert) setMenuOuvert(false);
  }

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const precedent = scrollY.getPrevious() ?? 0;
    setDefile(y > 12);
    if (y < 120) setCache(false);
    else if (y > precedent + 4) setCache(true);
    else if (y < precedent - 4) setCache(false);
  });

  // Verrouillage du défilement + touche Échap quand le menu mobile est ouvert.
  useEffect(() => {
    if (!menuOuvert) return;
    const html = document.documentElement;
    const ancienOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOuvert(false);
        boutonMenu.current?.focus();
      }
    };
    window.addEventListener("keydown", surTouche);
    return () => {
      html.style.overflow = ancienOverflow;
      document.body.style.overflow = "";
      window.removeEventListener("keydown", surTouche);
    };
  }, [menuOuvert]);

  // Repasse en mode bureau : on ferme le menu.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const surChange = () => mq.matches && setMenuOuvert(false);
    mq.addEventListener("change", surChange);
    return () => mq.removeEventListener("change", surChange);
  }, []);

  const visible = !cache || menuOuvert;

  // Les barres collantes des pages (filtres de la boutique) remontent quand l'en-tête se cache.
  useEffect(() => {
    document.documentElement.dataset.entete = visible ? "visible" : "cache";
  }, [visible]);

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[70] bg-noir px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>

      <motion.header
        initial={reduire ? false : { y: -120 }}
        animate={{ y: visible ? 0 : "-100%" }}
        transition={{ duration: reduire ? 0 : 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <BandeauAnnonces />
        <div
          className={clsx(
            "relative bg-white transition-shadow duration-500",
            defile || menuOuvert ? "shadow-[0_1px_0_#e5e5e5]" : "shadow-none",
          )}
        >
          <div className="mx-auto grid h-14 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-16 lg:grid-cols-[auto_1fr_auto] lg:px-8">
            {/* Menu (mobile) */}
            <button
              ref={boutonMenu}
              type="button"
              onClick={() => setMenuOuvert((o) => !o)}
              aria-expanded={menuOuvert}
              aria-controls="menu-mobile"
              aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
              className={`relative -ml-2 grid size-12 place-items-center text-noir lg:hidden ${focus}`}
            >
              <span aria-hidden="true" className="relative block h-3.5 w-6">
                <motion.span
                  className="absolute left-0 top-0 h-[2px] w-6 origin-center bg-current"
                  animate={menuOuvert ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: reduire ? 0 : 0.35, ease }}
                />
                <motion.span
                  className="absolute left-0 top-[6px] h-[2px] w-4 bg-current"
                  animate={menuOuvert ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                  transition={{ duration: reduire ? 0 : 0.25, ease }}
                />
                <motion.span
                  className="absolute left-0 top-[12px] h-[2px] w-6 origin-center bg-current"
                  animate={menuOuvert ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: reduire ? 0 : 0.35, ease }}
                />
              </span>
            </button>

            {/* Logo */}
            <Link href="/" aria-label={`${boutique.nom} — accueil`} className={`group justify-self-center lg:justify-self-start ${focus}`}>
              <motion.span
                className="block"
                whileHover={reduire ? undefined : { scale: 1.04 }}
                whileTap={reduire ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Logo prioritaire />
              </motion.span>
            </Link>

            {/* Navigation bureau */}
            <nav aria-label="Navigation principale" className="hidden justify-self-center lg:block">
              <ul className="flex items-center gap-2">
                {LIENS.map((lien) => {
                  const actif = estActif(pathname, lien.href);
                  return (
                    <li key={lien.href} className="relative">
                      <Link
                        href={lien.href}
                        aria-current={actif ? "page" : undefined}
                        className={clsx(
                          "group relative block px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.18em] transition-colors duration-300",
                          actif ? "text-noir" : "text-gris-500 hover:text-noir",
                          focus,
                        )}
                      >
                        {lien.label}
                        {actif ? (
                          <motion.span
                            layoutId="nav-actif"
                            aria-hidden="true"
                            className="absolute inset-x-4 -bottom-0.5 h-[2px] bg-noir"
                            transition={reduire ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-4 -bottom-0.5 h-[2px] origin-right scale-x-0 bg-noir transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-self-end gap-1 sm:gap-2">
              <a
                href={lienWhatsApp(messageQuestion())}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden items-center gap-2 bg-whatsapp px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-noir transition-colors duration-300 hover:bg-whatsapp-fonce xl:inline-flex ${focus}`}
              >
                <WhatsAppIcon className="size-4" />
                Nous écrire
              </a>
              <BoutonPanier nombre={nombre} onClick={ouvrirTiroir} reduire={!!reduire} />
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOuvert && (
          <MenuMobile pathname={pathname} reduire={!!reduire} fermer={() => setMenuOuvert(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------------------------------------------------------- */

function BoutonPanier({ nombre, onClick, reduire }: { nombre: number; onClick: () => void; reduire: boolean }) {
  const affiche = nombre > 99 ? "99+" : String(nombre);
  return (
    <motion.button
      id="icone-panier"
      type="button"
      onClick={onClick}
      whileHover={reduire ? undefined : { scale: 1.08 }}
      whileTap={reduire ? undefined : { scale: 0.9 }}
      aria-label={nombre > 0 ? `Ouvrir le panier (${nombre} article${nombre > 1 ? "s" : ""})` : "Ouvrir le panier (vide)"}
      className={`relative -mr-2 grid size-12 place-items-center text-noir ${focus}`}
    >
      <motion.span
        key={`sac-${nombre}`}
        className="grid place-items-center"
        initial={reduire || nombre === 0 ? false : { rotate: -16, y: -3 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 12 }}
      >
        <ShoppingBag className="size-6" strokeWidth={1.7} aria-hidden="true" />
      </motion.span>

      <AnimatePresence>
        {nombre > 0 && (
          <motion.span
            key="badge"
            initial={reduire ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduire ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
            className="absolute right-1 top-1.5"
            aria-hidden="true"
          >
            {!reduire && (
              <motion.span
                key={`onde-${nombre}`}
                className="absolute inset-0 rounded-full bg-noir"
                initial={{ scale: 1, opacity: 0.45 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}
            <motion.span
              key={`chiffre-${nombre}`}
              initial={reduire ? false : { scale: 1.7, y: -6 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 14 }}
              className="relative grid h-[18px] min-w-[18px] place-items-center rounded-full bg-noir px-1 text-[10px] font-bold leading-none text-white tabular-nums ring-2 ring-white"
            >
              {affiche}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ---------------------------------------------------------------- */

const conteneurMenu: Variants = {
  ferme: { clipPath: "inset(0 0 100% 0)" },
  ouvert: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], when: "beforeChildren", staggerChildren: 0.07 },
  },
  sortie: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], when: "afterChildren", staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const elementMenu: Variants = {
  ferme: { opacity: 0, y: "100%" },
  ouvert: { opacity: 1, y: "0%", transition: { duration: 0.6, ease } },
  sortie: { opacity: 0, y: "40%", transition: { duration: 0.2 } },
};

const conteneurMenuReduit: Variants = { ferme: { opacity: 0 }, ouvert: { opacity: 1 }, sortie: { opacity: 0 } };
const elementMenuReduit: Variants = { ferme: { opacity: 0 }, ouvert: { opacity: 1 }, sortie: { opacity: 0 } };

function MenuMobile({ pathname, reduire, fermer }: { pathname: string; reduire: boolean; fermer: () => void }) {
  const premierLien = useRef<HTMLAnchorElement>(null);
  const item = reduire ? elementMenuReduit : elementMenu;

  useEffect(() => {
    premierLien.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      variants={reduire ? conteneurMenuReduit : conteneurMenu}
      initial="ferme"
      animate="ouvert"
      exit="sortie"
      className="fixed inset-0 z-[45] flex flex-col overflow-y-auto overscroll-contain bg-white pt-[5.5rem] lg:hidden"
    >
      <nav aria-label="Navigation mobile" className="relative flex-1 px-5 pt-6 sm:px-10">
        <div className="overflow-hidden">
          <motion.p variants={item} className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-gris-500">
            Menu
          </motion.p>
        </div>
        <ul className="border-t border-gris-200">
          {LIENS.map((lien, i) => {
            const actif = estActif(pathname, lien.href);
            return (
              <li key={lien.href} className="overflow-hidden border-b border-gris-200">
                <motion.div variants={item}>
                  <Link
                    ref={i === 0 ? premierLien : undefined}
                    href={lien.href}
                    onClick={fermer}
                    aria-current={actif ? "page" : undefined}
                    className={`group flex items-center justify-between gap-4 py-4 ${focus}`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-6 text-xs font-bold text-gris-500 tabular-nums">0{i + 1}</span>
                      <span
                        className={clsx(
                          "font-affiche text-5xl uppercase leading-none tracking-wide",
                          actif ? "text-noir" : "texte-contour",
                        )}
                      >
                        {lien.label}
                      </span>
                    </span>
                    <span
                      className={clsx(
                        "grid size-11 shrink-0 place-items-center transition-transform duration-300 group-hover:translate-x-1 group-active:scale-90",
                        actif ? "bg-noir text-white" : "text-noir ring-1 ring-inset ring-noir",
                      )}
                    >
                      <ArrowUpRight className="size-5" aria-hidden="true" />
                    </span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>

        <div className="overflow-hidden">
          <motion.ul variants={item} className="mt-8 grid gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gris-700">
            <li>— Livraison partout à Kinshasa dès {formatFC(boutique.livraison.prixMinFC)}</li>
            <li>— Paiement cash à la livraison</li>
          </motion.ul>
        </div>
      </nav>

      <div className="overflow-hidden">
        <motion.div variants={item} className="relative px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-10">
          <a
            href={lienWhatsApp(messageQuestion())}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex min-h-14 w-full items-center justify-center gap-3 bg-whatsapp px-6 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-noir transition-transform active:scale-[0.97] ${focus}`}
          >
            <WhatsAppIcon className="size-5" />
            Commander sur WhatsApp
          </a>
          <p className="mt-3 text-center text-sm text-gris-500">{boutique.whatsappAffiche}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
