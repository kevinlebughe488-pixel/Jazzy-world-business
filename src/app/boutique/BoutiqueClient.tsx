"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpDown, ChevronDown, PackageSearch, RotateCcw, Search, Truck, X } from "lucide-react";
import { boutique, categories, produits } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductCard } from "@/components/product/ProductCard";
import { BandeauVitesse } from "@/components/animations/BandeauVitesse";

type Tri = "pertinence" | "prix-asc" | "prix-desc";

const OPTIONS_TRI: { valeur: Tri; libelle: string }[] = [
  { valeur: "pertinence", libelle: "Pertinence" },
  { valeur: "prix-asc", libelle: "Prix croissant" },
  { valeur: "prix-desc", libelle: "Prix décroissant" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Minuscules + suppression des accents, pour une recherche tolérante. */
function normaliser(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const entete: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const ligneEntete: Variants = {
  cache: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const ligneTitre: Variants = {
  cache: { y: "105%", rotate: 3 },
  visible: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
};

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
    <div className="relative overflow-x-clip pb-24">
      {/* ---------- En-tête ---------- */}
      <section className="relative isolate pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-32">
        <Container>
          <motion.div variants={entete} initial="cache" animate="visible">
            <motion.p
              variants={ligneEntete}
              className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500"
            >
              — {produits.length} produits sélectionnés pour vous
            </motion.p>
            <h1 className="mt-4 font-affiche text-[21vw] uppercase leading-[0.86] tracking-[0.01em] text-noir sm:text-[9rem] lg:text-[11rem]">
              <span className="block overflow-hidden">
                <motion.span variants={ligneTitre} className="block">
                  La
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={ligneTitre} className="texte-contour block [-webkit-text-stroke-width:2px]">
                  Boutique
                </motion.span>
              </span>
            </h1>
            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <motion.p variants={ligneEntete} className="max-w-xl text-base leading-relaxed text-gris-700 sm:text-lg">
                Bien-être, santé, beauté et accessoires : trouvez ce qui vous fait du bien, ajoutez-le au panier et
                commandez en un clic sur WhatsApp.
              </motion.p>
              <motion.ul
                variants={ligneEntete}
                className="flex flex-wrap gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-noir"
              >
                <li className="inline-flex items-center gap-2 px-3.5 py-2 ring-1 ring-inset ring-noir">
                  <Truck className="size-4" aria-hidden />
                  Kinshasa dès {formatFC(boutique.livraison.prixMinFC)}
                </li>
                <li className="inline-flex items-center gap-2 bg-noir px-3.5 py-2 text-white">
                  <span className="size-1.5 rounded-full bg-white" aria-hidden />
                  {boutique.paiement}
                </li>
              </motion.ul>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ---------- Bandeau qui accélère avec le défilement ---------- */}
      <div className="mb-8 bg-noir py-3 font-affiche text-4xl uppercase leading-none text-white sm:text-5xl">
        <BandeauVitesse vitesseBase={3}>
          {["Nouveautés", ...categories.map((c) => c.nom), "Cash à la livraison"].map((m) => (
            <span key={m} className="flex items-center whitespace-nowrap">
              {m}
              <span className="mx-6 inline-block size-2 rotate-45 bg-white" aria-hidden="true" />
            </span>
          ))}
        </BandeauVitesse>
      </div>

      {/* ---------- Barre de filtres (collante sous le header) ---------- */}
      <div className="sous-entete sticky z-30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="bg-white p-2.5 ring-1 ring-gris-200 sm:p-3"
          >
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
              {/* Catégories */}
              <LayoutGroup id="filtre-categories">
                <div
                  role="group"
                  aria-label="Filtrer par catégorie"
                  className="-mx-2.5 flex snap-x gap-1.5 overflow-x-auto px-2.5 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:flex-1 [&::-webkit-scrollbar]:hidden"
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
                          "relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2 px-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir",
                          actif ? "text-white" : "text-noir/75 hover:bg-noir/5 hover:text-noir",
                        )}
                      >
                        {actif && (
                          <motion.span
                            layoutId="pill-active"
                            aria-hidden
                            className="bg-noir absolute inset-0 -z-0"
                            transition={reduire ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative">{c.nom}</span>
                        <span
                          className={clsx(
                            "relative px-1.5 py-0.5 text-[11px] leading-none font-bold tabular-nums",
                            actif ? "bg-white text-noir" : "bg-gris-100 text-noir/60",
                          )}
                        >
                          {compteurs[c.id] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>

              <div className="flex gap-2">
                {/* Recherche */}
                <div className="group relative min-w-0 flex-1 lg:w-64 lg:flex-none">
                  <label htmlFor={idRecherche} className="sr-only">
                    Rechercher un produit par son nom
                  </label>
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-noir/45 transition-colors group-focus-within:text-noir"
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
                    className="h-11 w-full bg-gris-50 pr-10 pl-10 text-base text-noir ring-1 ring-gris-200 transition-shadow placeholder:text-noir/45 focus:bg-white focus:ring-2 focus:ring-noir focus:outline-none sm:text-sm [&::-webkit-search-cancel-button]:hidden"
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
                        className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center text-noir/60 hover:bg-noir/5 hover:text-noir focus-visible:outline-2 focus-visible:outline-noir"
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
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-noir"
                    aria-hidden
                  />
                  <select
                    id={idTri}
                    value={tri}
                    onChange={(e) => setTri(e.target.value as Tri)}
                    className="h-11 w-[10.25rem] cursor-pointer appearance-none bg-gris-50 pr-8 pl-9 text-base font-semibold text-noir ring-1 ring-gris-200 transition-shadow hover:ring-noir/25 focus:bg-white focus:ring-2 focus:ring-noir focus:outline-none sm:w-auto sm:text-sm"
                  >
                    {OPTIONS_TRI.map((o) => (
                      <option key={o.valeur} value={o.valeur}>
                        {o.libelle}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-noir/50"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* ---------- Résultats ---------- */}
      <Container className="mt-8 sm:mt-10">
        <div className="mb-5 flex min-h-9 items-center justify-between gap-4">
          <p className="text-sm text-noir/65" aria-live="polite">
            <motion.span
              key={resultats.length}
              initial={reduire ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block font-display text-base font-bold text-noir tabular-nums"
            >
              {resultats.length}
            </motion.span>{" "}
            {resultats.length > 1 ? "produits" : "produit"}
            {recherche.trim() && (
              <>
                {" "}
                pour « <span className="font-semibold text-noir">{recherche.trim()}</span> »
              </>
            )}
          </p>
          <AnimatePresence>
            {filtresActifs && (
              <motion.button
                type="button"
                onClick={reinitialiser}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="inline-flex min-h-9 items-center gap-1.5 px-3 text-sm font-semibold text-noir hover:bg-gris-100 focus-visible:outline-2 focus-visible:outline-noir"
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
              className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {resultats.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout={reduire ? false : "position"}
                    initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.88, filter: "blur(4px)" }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: reduire ? 0 : Math.min(i, 8) * 0.035,
                      layout: { type: "spring", stiffness: 260, damping: 30 },
                    }}
                    className="min-w-0"
                  >
                    <ProductCard produit={p} index={i} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.div
              key="vide"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative mx-auto flex max-w-xl flex-col items-center overflow-hidden bg-white px-6 py-14 text-center ring-1 ring-gris-200 sm:px-10"
            >
              <div aria-hidden className="bg-noir absolute inset-x-0 top-0 h-1" />
              <motion.div
                animate={reduire ? undefined : { y: [0, -8, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="grid size-20 place-items-center bg-gris-50 ring-1 ring-gris-300"
              >
                <PackageSearch className="size-9 text-noir" aria-hidden />
              </motion.div>
              <h2 className="mt-6 font-display text-2xl font-bold text-noir">Aucun produit trouvé</h2>
              <p className="mt-2 text-noir/65">
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
                  href={lienWhatsApp(
                    recherche.trim()
                      ? messageQuestion(recherche.trim())
                      : messageQuestion(),
                  )}
                  externe
                >
                  <WhatsAppIcon className="size-5" />
                  Nous demander
                </ButtonLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
