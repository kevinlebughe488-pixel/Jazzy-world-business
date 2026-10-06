"use client";

import clsx from "clsx";
import Image from "next/image";
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
import { ArrowUpRight, ShoppingBag, Truck, Banknote } from "lucide-react";
import { usePanier, nombreArticles } from "@/lib/cart";
import { boutique } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { formatFC } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/boutique/", label: "Boutique" },
  { href: "/infos/", label: "Livraison & infos" },
] as const;

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
    if (y < 80) setCache(false);
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
  const vitreux = defile || menuOuvert;

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[70] rounded-full bg-nuit px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>

      <motion.header
        initial={reduire ? false : { y: -96, opacity: 0 }}
        animate={{ y: visible ? 0 : "-110%", opacity: 1 }}
        transition={{ duration: reduire ? 0 : 0.45, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={clsx(
            "relative transition-[background-color,box-shadow,backdrop-filter] duration-500",
            vitreux
              ? "verre shadow-[0_8px_30px_-12px_rgba(36,26,82,0.25)] ring-1 ring-nuit/5"
              : "bg-transparent",
          )}
        >
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
            {/* Logo */}
            <Link
              href="/"
              aria-label={`${boutique.nom} — accueil`}
              className="group relative -ml-1 flex shrink-0 items-center rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
            >
              <motion.span
                className="block"
                whileHover={reduire ? undefined : { scale: 1.04 }}
                whileTap={reduire ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Image
                  src="/brand/logo.webp"
                  alt={boutique.nom}
                  width={640}
                  height={308}
                  priority
                  className="h-9 w-auto lg:h-11"
                />
              </motion.span>
            </Link>

            {/* Navigation bureau */}
            <nav aria-label="Navigation principale" className="hidden lg:block">
              <ul className="flex items-center gap-1 rounded-full bg-white/50 p-1.5 ring-1 ring-nuit/5">
                {LIENS.map((lien) => {
                  const actif = estActif(pathname, lien.href);
                  return (
                    <li key={lien.href} className="relative">
                      <Link
                        href={lien.href}
                        aria-current={actif ? "page" : undefined}
                        className={clsx(
                          "relative z-10 block rounded-full px-5 py-2 text-[0.95rem] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                          actif ? "text-white" : "text-nuit/75 hover:text-nuit",
                        )}
                      >
                        {actif && (
                          <motion.span
                            layoutId="nav-actif"
                            aria-hidden="true"
                            className="degrade-marque absolute inset-0 -z-10 rounded-full shadow-md shadow-violet/30"
                            transition={reduire ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        {lien.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href={lienWhatsApp(messageQuestion())}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-whatsapp/30 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-whatsapp/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet xl:inline-flex"
              >
                <WhatsAppIcon className="size-4" />
                Nous écrire
              </a>

              <BoutonPanier nombre={nombre} onClick={ouvrirTiroir} reduire={!!reduire} />

              <button
                ref={boutonMenu}
                type="button"
                onClick={() => setMenuOuvert((o) => !o)}
                aria-expanded={menuOuvert}
                aria-controls="menu-mobile"
                aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
                className="relative grid size-12 place-items-center rounded-full text-nuit transition-colors hover:bg-nuit/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet lg:hidden"
              >
                <span aria-hidden="true" className="relative block h-4 w-6">
                  <motion.span
                    className="absolute left-0 top-0 h-0.5 w-6 origin-center rounded-full bg-current"
                    animate={menuOuvert ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: reduire ? 0 : 0.35, ease }}
                  />
                  <motion.span
                    className="absolute left-0 top-[7px] h-0.5 w-4 rounded-full bg-current"
                    animate={menuOuvert ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                    transition={{ duration: reduire ? 0 : 0.25, ease }}
                  />
                  <motion.span
                    className="absolute left-0 top-[14px] h-0.5 w-6 origin-center rounded-full bg-current"
                    animate={menuOuvert ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: reduire ? 0 : 0.35, ease }}
                  />
                </span>
              </button>
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
      whileHover={reduire ? undefined : { scale: 1.06 }}
      whileTap={reduire ? undefined : { scale: 0.92 }}
      aria-label={nombre > 0 ? `Ouvrir le panier (${nombre} article${nombre > 1 ? "s" : ""})` : "Ouvrir le panier (vide)"}
      className="relative grid size-12 place-items-center rounded-full bg-white text-nuit shadow-sm ring-1 ring-nuit/10 transition-shadow hover:shadow-md hover:shadow-violet/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
    >
      <motion.span
        key={`sac-${nombre}`}
        className="grid place-items-center"
        initial={reduire || nombre === 0 ? false : { rotate: -14, y: -2 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 12 }}
      >
        <ShoppingBag className="size-[22px]" strokeWidth={1.9} aria-hidden="true" />
      </motion.span>

      <AnimatePresence>
        {nombre > 0 && (
          <motion.span
            key="badge"
            initial={reduire ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduire ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
            className="absolute -right-1 -top-1"
            aria-hidden="true"
          >
            {!reduire && (
              <motion.span
                key={`onde-${nombre}`}
                className="absolute inset-0 rounded-full bg-violet"
                initial={{ scale: 1, opacity: 0.55 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}
            <motion.span
              key={`chiffre-${nombre}`}
              initial={reduire ? false : { scale: 1.6, y: -6 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 14 }}
              className="degrade-marque relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold leading-none text-white tabular-nums shadow-md shadow-violet/40 ring-2 ring-white"
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
  ferme: { opacity: 0 },
  ouvert: { opacity: 1, transition: { duration: 0.3, when: "beforeChildren", staggerChildren: 0.07, delayChildren: 0.05 } },
  sortie: { opacity: 0, transition: { duration: 0.25, when: "afterChildren", staggerChildren: 0.03, staggerDirection: -1 } },
};

const elementMenu: Variants = {
  ferme: { opacity: 0, y: 32, filter: "blur(6px)" },
  ouvert: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease } },
  sortie: { opacity: 0, y: 16, transition: { duration: 0.2 } },
};

const elementMenuReduit: Variants = {
  ferme: { opacity: 0 },
  ouvert: { opacity: 1 },
  sortie: { opacity: 0 },
};

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
      variants={conteneurMenu}
      initial="ferme"
      animate="ouvert"
      exit="sortie"
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-creme pt-16 lg:hidden"
    >
      {/* Décor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-24 -top-24 size-80 rounded-full bg-violet/25 blur-3xl"
          initial={reduire ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease }}
        />
        <motion.div
          className="absolute -bottom-32 -left-24 size-96 rounded-full bg-ciel/25 blur-3xl"
          initial={reduire ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
        />
        <Image
          src="/brand/globe.webp"
          alt=""
          width={600}
          height={600}
          className="absolute -right-20 bottom-40 w-64 opacity-[0.07]"
        />
      </div>

      <nav aria-label="Navigation mobile" className="relative flex-1 px-6 pt-8 sm:px-10">
        <motion.p variants={item} className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet">
          Menu
        </motion.p>
        <ul className="space-y-1">
          {LIENS.map((lien, i) => {
            const actif = estActif(pathname, lien.href);
            return (
              <motion.li key={lien.href} variants={item}>
                <Link
                  ref={i === 0 ? premierLien : undefined}
                  href={lien.href}
                  onClick={fermer}
                  aria-current={actif ? "page" : undefined}
                  className="group flex items-center justify-between gap-4 rounded-2xl py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="w-6 font-display text-sm font-medium text-nuit/40 tabular-nums">
                      0{i + 1}
                    </span>
                    <span
                      className={clsx(
                        "font-display text-4xl font-semibold tracking-tight sm:text-5xl",
                        actif ? "texte-degrade" : "text-nuit",
                      )}
                    >
                      {lien.label}
                    </span>
                  </span>
                  <span
                    className={clsx(
                      "grid size-11 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300 group-hover:translate-x-1 group-active:scale-90",
                      actif ? "degrade-marque text-white" : "bg-white text-nuit ring-1 ring-nuit/10",
                    )}
                  >
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <motion.ul variants={item} className="mt-10 grid gap-3 text-sm text-nuit/75">
          <li className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-nuit/10">
              <Truck className="size-4 text-violet" aria-hidden="true" />
            </span>
            Livraison partout à Kinshasa dès {formatFC(boutique.livraison.prixMinFC)}
          </li>
          <li className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-nuit/10">
              <Banknote className="size-4 text-violet" aria-hidden="true" />
            </span>
            Paiement cash à la livraison
          </li>
        </motion.ul>
      </nav>

      <motion.div variants={item} className="relative px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-10">
        <a
          href={lienWhatsApp(messageQuestion())}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-whatsapp px-6 py-4 text-base font-semibold text-white shadow-lg shadow-whatsapp/30 transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
        >
          <WhatsAppIcon className="size-5" />
          Commander sur WhatsApp
        </a>
        <p className="mt-3 text-center text-sm text-nuit/60">{boutique.whatsappAffiche}</p>
      </motion.div>
    </motion.div>
  );
}
