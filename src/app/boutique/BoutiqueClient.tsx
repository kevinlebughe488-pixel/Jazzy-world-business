"use client";

import { useDeferredValue, useId, useMemo, useState, type CSSProperties } from "react";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUpDown, ChevronDown, PackageSearch, RotateCcw, Search, X } from "lucide-react";
import { categories, produits } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductCard } from "@/components/product/ProductCard";

type Tri = "pertinence" | "prix-asc" | "prix-desc";

const OPTIONS_TRI: { valeur: Tri; libelle: string }[] = [
  { valeur: "pertinence", libelle: "Pertinence" },
  { valeur: "prix-asc", libelle: "Prix croissant" },
  { valeur: "prix-desc", libelle: "Prix décroissant" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const delai = (d: string) => ({ "--d": d }) as CSSProperties;

/** Minuscules + suppression des accents, pour une recherche tolérante. */
function normaliser(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function BoutiqueClient() {
  const reduire = useReducedMotion();
  const idRecherche = useId();
  const idTri = useId();

  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<Tri>("pertinence");
  const [recherche, setRecherche] = useState("");
  const rechercheDifferee = useDeferredValue(recherche);

  const compteurs = useMemo(() => {
    const c: Record<string, number> = { tous: produits.length };
    for (const p of produits) c[p.categorie] = (c[p.categorie] ?? 0) + 1;
    return c;
  }, []);

  const resultats = useMemo(() => {
    const q = normaliser(rechercheDifferee);
    const liste = produits
      .map((p, rang) => ({ p, rang }))
      .filter(({ p }) => categorie === "tous" || p.categorie === categorie)
      .filter(({ p }) => !q || normaliser(p.nom).includes(q));

    liste.sort((a, b) => {
      if (tri === "prix-asc") return a.p.prix - b.p.prix || a.rang - b.rang;
      if (tri === "prix-desc") return b.p.prix - a.p.prix || a.rang - b.rang;
      // Pertinence : produits en stock et vedettes d'abord, puis ordre du catalogue.
      const score = (x: typeof a) => (x.p.enStock ? 0 : 2) + (x.p.vedette ? 0 : 1);
      return score(a) - score(b) || a.rang - b.rang;
    });
    return liste.map(({ p }) => p);
  }, [categorie, tri, rechercheDifferee]);

  const filtresActifs = categorie !== "tous" || recherche.trim() !== "" || tri !== "pertinence";

  function reinitialiser() {
    setCategorie("tous");
    setTri("pertinence");
    setRecherche("");
  }

  const pills = [{ id: "tous", nom: "Tous" }, ...categories];

  return (
    <div className="pb-24">
      {/* ---------- En-tête ---------- */}
      <section className="pb-10 pt-12 sm:pb-12 sm:pt-16 lg:pt-20">
        <Container>
          <p className="entree etiquette">{produits.length} produits sélectionnés</p>
          <h1
            className="entree mt-4 font-serif text-6xl leading-[0.98] tracking-[-0.015em] sm:text-7xl lg:text-8xl"
            style={delai("0.06s")}
          >
            La <em>boutique</em>
          </h1>
          <p
            className="entree mt-5 max-w-xl text-lg leading-relaxed text-encre-doux"
            style={delai("0.12s")}
          >
            Bien-être, santé, beauté et accessoires. Ajoutez vos articles au panier et commandez en un message
            WhatsApp.
          </p>
        </Container>
      </section>

      {/* ---------- Barre de filtres (collante sous l'en-tête) ---------- */}
      <div className="sous-entete sticky z-30">
        <Container>
          <div
            className="entree rounded-carte bg-carte/90 p-2 shadow-doux ring-1 ring-inset ring-trait backdrop-blur-md lg:rounded-full"
            style={delai("0.18s")}
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              {/* Catégories */}
              <LayoutGroup id="filtre-categories">
                <div
                  role="group"
                  aria-label="Filtrer par catégorie"
                  className="-mx-2 flex snap-x gap-1 overflow-x-auto px-2 [scrollbar-width:none] lg:mx-0 lg:flex-1 lg:px-0 [&::-webkit-scrollbar]:hidden"
                >
                  {pills.map((c) => {
                    const actif = categorie === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={actif}
                        onClick={() => setCategorie(c.id)}
                        className={clsx(
                          "relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.92rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre",
                          actif ? "text-papier" : "text-encre-doux hover:bg-encre/5 hover:text-encre",
                        )}
                      >
                        {actif && (
                          <motion.span
                            layoutId="pill-active"
                            aria-hidden
                            className="absolute inset-0 rounded-full bg-encre"
                            transition={reduire ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                          />
                        )}
                        <span className="relative">{c.nom}</span>
                        <span className={clsx("relative text-xs tabular-nums", actif ? "text-papier/60" : "text-muet")}>
                          {compteurs[c.id] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>

              <div className="flex gap-2">
                {/* Recherche */}
                <div className="group relative min-w-0 flex-1 lg:w-60 lg:flex-none">
                  <label htmlFor={idRecherche} className="sr-only">
                    Rechercher un produit par son nom
                  </label>
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muet transition-colors group-focus-within:text-encre"
                    aria-hidden
                  />
                  <input
                    id={idRecherche}
                    type="search"
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    placeholder="Rechercher…"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="h-11 w-full rounded-full bg-papier pl-10 pr-10 text-base text-encre ring-1 ring-inset ring-trait transition-shadow placeholder:text-muet focus:bg-carte focus:outline-none focus:ring-2 focus:ring-encre sm:text-[0.92rem] [&::-webkit-search-cancel-button]:hidden"
                  />
                  <AnimatePresence>
                    {recherche && (
                      <motion.button
                        type="button"
                        aria-label="Effacer la recherche"
                        onClick={() => setRecherche("")}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muet hover:bg-encre/5 hover:text-encre focus-visible:outline-2 focus-visible:outline-encre"
                      >
                        <X className="size-4" aria-hidden />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tri */}
                <div className="relative shrink-0">
                  <label htmlFor={idTri} className="sr-only">
                    Trier les produits
                  </label>
                  <ArrowUpDown
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-encre"
                    aria-hidden
                  />
                  <select
                    id={idTri}
                    value={tri}
                    onChange={(e) => setTri(e.target.value as Tri)}
                    className="h-11 w-[10.5rem] cursor-pointer appearance-none rounded-full bg-papier pl-10 pr-9 text-base text-encre ring-1 ring-inset ring-trait transition-shadow hover:ring-encre/30 focus:bg-carte focus:outline-none focus:ring-2 focus:ring-encre sm:w-auto sm:text-[0.92rem]"
                  >
                    {OPTIONS_TRI.map((o) => (
                      <option key={o.valeur} value={o.valeur}>
                        {o.libelle}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muet"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ---------- Résultats ---------- */}
      <Container className="mt-8 sm:mt-10">
        <div className="mb-5 flex min-h-9 items-center justify-between gap-4">
          <p className="text-[0.95rem] text-muet" aria-live="polite">
            <span className="font-medium text-encre tabular-nums">{resultats.length}</span>{" "}
            {resultats.length > 1 ? "produits" : "produit"}
            {recherche.trim() && (
              <>
                {" "}
                pour « <span className="font-medium text-encre">{recherche.trim()}</span> »
              </>
            )}
          </p>
          <AnimatePresence>
            {filtresActifs && (
              <motion.button
                type="button"
                onClick={reinitialiser}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-encre hover:bg-encre/5 focus-visible:outline-2 focus-visible:outline-encre"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Réinitialiser
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {resultats.length > 0 ? (
            <motion.ul
              key="grille"
              layout={!reduire}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {resultats.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout={reduire ? false : "position"}
                    initial={reduire ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: reduire ? 0 : Math.min(i, 8) * 0.04,
                      layout: { type: "spring", stiffness: 260, damping: 32 },
                    }}
                    className="min-w-0"
                  >
                    <ProductCard produit={p} prioritaire={i < 2} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.div
              key="vide"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto flex max-w-xl flex-col items-center rounded-carte bg-carte px-6 py-14 text-center shadow-doux sm:px-10"
            >
              <span className="grid size-16 place-items-center rounded-full bg-lin text-encre-doux">
                <PackageSearch className="size-7" strokeWidth={1.6} aria-hidden />
              </span>
              <h2 className="mt-6 font-serif text-3xl">Aucun produit trouvé</h2>
              <p className="mt-2 leading-relaxed text-encre-doux">
                {recherche.trim()
                  ? `Nous n'avons rien trouvé pour « ${recherche.trim()} ». Essayez un autre mot ou une autre catégorie.`
                  : "Aucun produit dans cette catégorie pour le moment."}{" "}
                Vous cherchez quelque chose de précis ? Demandez-nous sur WhatsApp.
              </p>
              <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button variante="secondaire" onClick={reinitialiser}>
                  <RotateCcw className="size-4" aria-hidden />
                  Voir tous les produits
                </Button>
                <ButtonLink
                  variante="whatsapp"
                  href={lienWhatsApp(recherche.trim() ? messageQuestion(recherche.trim()) : messageQuestion())}
                  externe
                >
                  <WhatsAppIcon className="size-5" />
                  Écrire sur WhatsApp
                </ButtonLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
