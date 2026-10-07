"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { usePanier, nombreArticles } from "@/lib/cart";
import { boutique } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { formatFC } from "@/lib/format";
import { useMonte } from "@/lib/useMonte";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/boutique/", label: "Boutique" },
  { href: "/infos/", label: "Livraison & infos" },
] as const;

function normaliser(chemin: string) {
  return chemin.endsWith("/") ? chemin : `${chemin}/`;
}

function estActif(pathname: string, href: string) {
  const p = normaliser(pathname);
  if (href === "/") return p === "/";
  if (href === "/boutique/") return p.startsWith("/boutique/") || p.startsWith("/produits/");
  return p.startsWith(href);
}

const ease = [0.16, 1, 0.3, 1] as const;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre";

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
    setDefile(y > 8);
    if (y < 160) setCache(false);
    else if (y > precedent + 6) setCache(true);
    else if (y < precedent - 6) setCache(false);
  });

  // Verrouillage du défilement + touche Échap quand le menu mobile est ouvert.
  useEffect(() => {
    if (!menuOuvert) return;
    const html = document.documentElement;
    const ancienOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOuvert(false);
        boutonMenu.current?.focus();
      }
    };
    window.addEventListener("keydown", surTouche);
    return () => {
      html.style.overflow = ancienOverflow;
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
        className="sr-only z-[70] rounded-full bg-encre px-4 py-2 text-sm font-medium text-papier focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>

      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : "-100%" }}
        transition={{ duration: reduire ? 0 : 0.45, ease }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
          defile || menuOuvert
            ? "bg-papier/85 shadow-[0_1px_0_var(--color-trait)] backdrop-blur-md"
            : "bg-papier",
        )}
      >
        <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:grid-cols-[auto_1fr_auto] lg:px-8">
          {/* Menu (mobile) */}
          <button
            ref={boutonMenu}
            type="button"
            onClick={() => setMenuOuvert((o) => !o)}
            aria-expanded={menuOuvert}
            aria-controls="menu-mobile"
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            className={`-ml-2 grid size-11 place-items-center rounded-full text-encre lg:hidden ${focus}`}
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <motion.span
                className="absolute left-0 top-0 h-[1.5px] w-5 origin-center rounded-full bg-current"
                animate={menuOuvert ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: reduire ? 0 : 0.3, ease }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-[1.5px] w-5 origin-center rounded-full bg-current"
                animate={menuOuvert ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: reduire ? 0 : 0.3, ease }}
              />
            </span>
          </button>

          {/* Logo */}
          <Link href="/" aria-label={`${boutique.nom}, accueil`} className={`justify-self-center rounded-md lg:justify-self-start ${focus}`}>
            <Logo prioritaire />
          </Link>

          {/* Navigation bureau */}
          <nav aria-label="Navigation principale" className="hidden justify-self-center lg:block">
            <ul className="flex items-center gap-1">
              {LIENS.map((lien) => {
                const actif = estActif(pathname, lien.href);
                return (
                  <li key={lien.href}>
                    <Link
                      href={lien.href}
                      aria-current={actif ? "page" : undefined}
                      className={clsx(
                        "relative block rounded-full px-4 py-2 text-[0.95rem] transition-colors duration-300",
                        actif ? "text-encre" : "text-muet hover:text-encre",
                        focus,
                      )}
                    >
                      {lien.label}
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "absolute inset-x-4 bottom-1 h-px origin-left bg-ocre transition-transform duration-500 ease-[var(--ease-doux)]",
                          actif ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-self-end gap-2">
            <a
              href={lienWhatsApp(messageQuestion())}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden min-h-10 items-center gap-2 rounded-full bg-whatsapp ring-1 ring-inset ring-trait-fort px-4 text-sm font-medium text-encre transition-colors duration-300 hover:bg-whatsapp-fonce xl:inline-flex ${focus}`}
            >
              <WhatsAppIcon className="size-4" />
              Écrire sur WhatsApp
            </a>
            <BoutonPanier nombre={nombre} onClick={ouvrirTiroir} />
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOuvert && <MenuMobile pathname={pathname} reduire={!!reduire} fermer={() => setMenuOuvert(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ---------------------------------------------------------------- */

function BoutonPanier({ nombre, onClick }: { nombre: number; onClick: () => void }) {
  const affiche = nombre > 99 ? "99+" : String(nombre);
  return (
    <button
      id="icone-panier"
      type="button"
      onClick={onClick}
      aria-label={nombre > 0 ? `Ouvrir le panier (${nombre} article${nombre > 1 ? "s" : ""})` : "Ouvrir le panier (vide)"}
      className={`relative -mr-1 grid size-11 place-items-center rounded-full bg-carte text-encre ring-1 ring-inset ring-trait-fort transition-[box-shadow,transform] duration-300 hover:ring-encre/40 active:scale-95 ${focus}`}
    >
      <ShoppingBag className="size-[1.15rem]" strokeWidth={1.8} aria-hidden="true" />
      <AnimatePresence>
        {nombre > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-encre px-1 text-[0.65rem] font-semibold leading-none text-papier tabular-nums ring-2 ring-papier"
          >
            {affiche}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ---------------------------------------------------------------- */

function MenuMobile({ pathname, reduire, fermer }: { pathname: string; reduire: boolean; fermer: () => void }) {
  const premierLien = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    premierLien.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduire ? 0 : 0.3, ease }}
      className="fixed inset-0 z-[45] flex flex-col overflow-y-auto overscroll-contain bg-papier pt-16 lg:hidden"
    >
      <nav aria-label="Navigation mobile" className="flex-1 px-5 pt-8 sm:px-10">
        <ul className="divide-y divide-trait border-y border-trait">
          {LIENS.map((lien, i) => {
            const actif = estActif(pathname, lien.href);
            return (
              <motion.li
                key={lien.href}
                initial={reduire ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease }}
              >
                <Link
                  ref={i === 0 ? premierLien : undefined}
                  href={lien.href}
                  onClick={fermer}
                  aria-current={actif ? "page" : undefined}
                  className={`group flex items-center justify-between gap-4 py-5 ${focus}`}
                >
                  <span className={clsx("font-serif text-[2.6rem] leading-none", actif ? "text-encre" : "text-encre-doux")}>
                    {actif ? <em>{lien.label}</em> : lien.label}
                  </span>
                  <span
                    className={clsx(
                      "grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-300 group-active:scale-90",
                      actif ? "bg-ocre text-encre" : "ring-1 ring-inset ring-trait-fort text-encre",
                    )}
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-xs text-sm leading-relaxed text-muet">
          Livraison partout à Kinshasa dès {formatFC(boutique.livraison.prixMinFC)}. Paiement cash à la livraison.
        </p>
      </nav>

      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-10">
        <a
          href={lienWhatsApp(messageQuestion())}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp ring-1 ring-inset ring-trait-fort px-6 font-medium text-encre transition-transform active:scale-[0.98] ${focus}`}
        >
          <WhatsAppIcon className="size-5" />
          Écrire sur WhatsApp
        </a>
        <p className="mt-3 text-center text-sm text-muet tabular-nums">{boutique.whatsappAffiche}</p>
      </div>
    </motion.div>
  );
}
