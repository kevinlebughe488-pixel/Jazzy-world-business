"use client";

import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Banknote, Check, MessageCircle, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { boutique, type Produit } from "@/lib/catalogue";
import { formatFC, formatUSD } from "@/lib/format";
import { lienWhatsApp, messageCommande, messageQuestion } from "@/lib/whatsapp";

const EASE = [0.22, 1, 0.36, 1] as const;

const conteneur: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const element: Variants = {
  cache: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

const POINTS_PAR_DEFAUT = [
  "Produit vérifié avant chaque livraison",
  "Livraison partout à Kinshasa",
  "Vous payez cash à la réception",
  "Conseils et suivi sur WhatsApp",
];

const abonnementVide = () => () => {};

/** false au rendu serveur / hydratation, true ensuite (évite les écarts d'hydratation). */
function useMonte() {
  return useSyncExternalStore(
    abonnementVide,
    () => true,
    () => false,
  );
}

export function PanneauAchat({ produit, categorie }: { produit: Produit; categorie?: string }) {
  const reduire = useReducedMotion();
  const monte = useMonte();
  const [quantite, setQuantite] = useState(1);
  const [barreVisible, setBarreVisible] = useState(false);
  const zoneAchat = useRef<HTMLDivElement>(null);

  const image = produit.images[0];
  const accroche = produit.accroche.trim();
  const description = produit.description.trim();
  const points = produit.pointsForts.filter((p) => p.trim());
  const pointsAffiches = points.length > 0 ? points : POINTS_PAR_DEFAUT;
  const total = produit.prix * quantite;

  const lienCommande = lienWhatsApp(messageCommande([{ id: produit.id, quantite }]));
  const lienQuestion = lienWhatsApp(messageQuestion(produit.nom));

  // La barre mobile apparaît dès que la zone d'achat principale n'est plus visible.
  useEffect(() => {
    const cible = zoneAchat.current;
    if (!cible || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setBarreVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(cible);
    return () => obs.disconnect();
  }, []);

  const variantesConteneur = reduire ? undefined : conteneur;
  const variantesElement = reduire ? undefined : element;

  return (
    <>
      <motion.div
        className="flex flex-col"
        variants={variantesConteneur}
        initial="cache"
        animate="visible"
      >
        {categorie && (
          <motion.p variants={variantesElement}>
            <span className="inline-flex items-center gap-2 rounded-full bg-bleu/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-bleu">
              <span className="size-1.5 rounded-full bg-bleu" aria-hidden />
              {categorie}
            </span>
          </motion.p>
        )}

        <motion.h1
          variants={variantesElement}
          className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] text-nuit sm:text-5xl"
        >
          {produit.nom}
        </motion.h1>

        <motion.p variants={variantesElement} className="mt-3 text-pretty text-lg leading-relaxed text-nuit/70">
          {accroche || "Qualité vérifiée, livré chez vous à Kinshasa et payé à la réception."}
        </motion.p>

        <motion.div variants={variantesElement} className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
          <p className="font-display text-5xl font-extrabold tracking-tight">
            <span className="sr-only">Prix : </span>
            <span className="texte-degrade">{formatUSD(produit.prix)}</span>
          </p>
          {produit.enStock ? (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/15">
              <span className="relative flex size-2">
                {!reduire && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              En stock
            </span>
          ) : (
            <span className="mb-2 rounded-full bg-nuit/10 px-3 py-1 text-sm font-medium text-nuit">
              Bientôt de retour
            </span>
          )}
        </motion.div>

        {/* Zone d'achat */}
        <motion.div
          ref={zoneAchat}
          variants={variantesElement}
          className="mt-8 rounded-[1.75rem] bg-white p-4 shadow-[0_1px_2px_rgba(15,27,61,0.05),0_20px_40px_-24px_rgba(15,27,61,0.25)] ring-1 ring-nuit/5 sm:p-5"
        >
          {produit.enStock ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <span id="libelle-quantite" className="text-sm font-semibold text-nuit/70">
                  Quantité
                </span>
                <Stepper quantite={quantite} onChange={setQuantite} />
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-nuit/10 pt-4">
                <span className="text-sm text-nuit/60">Total articles</span>
                <span className="font-display text-2xl font-bold text-nuit" aria-live="polite">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={total}
                      className="inline-block"
                      initial={reduire ? { opacity: 0 } : { opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduire ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {formatUSD(total)}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <AddToCartButton produitId={produit.id} quantite={quantite} image={image} className="w-full" />
                <motion.a
                  href={lienCommande}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduire ? undefined : { scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 text-base font-semibold text-white shadow-lg shadow-whatsapp/30 transition-shadow hover:shadow-whatsapp/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
                >
                  <WhatsAppIcon className="size-5" />
                  <span>
                    Commander <span className="hidden xl:inline">directement </span>sur WhatsApp
                  </span>
                </motion.a>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed text-nuit/70">
                Ce produit revient très vite. Écrivez-nous pour être prévenu(e) ou réserver le vôtre.
              </p>
              <a
                href={lienQuestion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 font-semibold text-white shadow-lg shadow-whatsapp/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu"
              >
                <WhatsAppIcon className="size-5" />
                Me prévenir sur WhatsApp
              </a>
            </div>
          )}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-nuit/55">
            <ShieldCheck className="size-3.5 text-bleu" aria-hidden />
            Aucun paiement en ligne : vous payez à la livraison.
          </p>
        </motion.div>

        {/* Cartes infos */}
        <motion.div variants={variantesElement} className="mt-5 grid gap-3 sm:grid-cols-2">
          <CarteInfo
            icone={<Truck className="size-5" aria-hidden />}
            titre={`Livraison dès ${formatFC(boutique.livraison.prixMinFC)}`}
            texte="Partout à Kinshasa. Le prix exact dépend du trajet, confirmé sur WhatsApp."
            couleur="ciel"
          />
          <CarteInfo
            icone={<Banknote className="size-5" aria-hidden />}
            titre="Cash à la livraison"
            texte="Vous vérifiez votre colis, puis vous payez. Simple et sans risque."
            couleur="violet"
          />
        </motion.div>
      </motion.div>

      {/* Description & points forts */}
      <div className="mt-12">
        <motion.h2
          initial={reduire ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-display text-2xl font-bold text-nuit"
        >
          {points.length > 0 ? "Points forts" : "Pourquoi commander chez nous"}
        </motion.h2>
        <motion.ul
          className="mt-5 grid gap-3"
          variants={reduire ? undefined : { visible: { transition: { staggerChildren: 0.09 } } }}
          initial="cache"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {pointsAffiches.map((point) => (
            <motion.li
              key={point}
              variants={
                reduire
                  ? undefined
                  : {
                      cache: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
                    }
              }
              className="flex items-start gap-3 rounded-2xl bg-white/70 p-3.5 ring-1 ring-nuit/5"
            >
              <motion.span
                variants={
                  reduire
                    ? undefined
                    : {
                        cache: { scale: 0, rotate: -45 },
                        visible: {
                          scale: 1,
                          rotate: 0,
                          transition: { type: "spring", stiffness: 500, damping: 18, delay: 0.15 },
                        },
                      }
                }
                className="degrade-marque grid size-6 shrink-0 place-items-center rounded-full text-white"
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </motion.span>
              <span className="pt-0.5 text-[15px] leading-snug text-nuit/85">{point}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={reduire ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10"
        >
          <h2 className="font-display text-2xl font-bold text-nuit">Description</h2>
          {description ? (
            <div className="mt-4 space-y-4 text-pretty text-base leading-relaxed text-nuit/75">
              {description.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-pretty text-base leading-relaxed text-nuit/75">
              Vous voulez plus de détails sur ce produit (utilisation, taille, couleurs disponibles) ? Écrivez-nous
              sur WhatsApp, nous vous répondons rapidement avec photos et conseils.
            </p>
          )}
          <a
            href={lienQuestion}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full font-semibold text-bleu focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bleu"
          >
            <MessageCircle className="size-4" aria-hidden />
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
              Poser une question sur ce produit
            </span>
          </a>
        </motion.div>
      </div>

      {/* Barre collante mobile */}
      {monte &&
        produit.enStock &&
        createPortal(
          <AnimatePresence>
            {barreVisible && (
              <motion.div
                key="barre-achat"
                initial={reduire ? { opacity: 0 } : { y: "110%" }}
                animate={reduire ? { opacity: 1 } : { y: 0 }}
                exit={reduire ? { opacity: 0 } : { y: "110%" }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
                className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
              >
                <div
                  className="border-t border-nuit/10 bg-white/90 backdrop-blur-xl shadow-[0_-12px_32px_-12px_rgba(15,27,61,0.25)]"
                  style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                  {/* pr : laisse la place au bouton WhatsApp flottant (bas à droite) */}
                  <div className="flex items-center gap-3 py-2.5 pl-4 pr-[5.25rem]">
                    {image && (
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-nuit/10">
                        <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-nuit/65">
                        {quantite > 1 ? `${quantite} × ` : ""}
                        {produit.nom}
                      </p>
                      <p className="font-display text-lg font-bold leading-tight text-nuit">{formatUSD(total)}</p>
                    </div>
                    <AddToCartButton produitId={produit.id} quantite={quantite} image={image} compact />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function Stepper({ quantite, onChange }: { quantite: number; onChange: (q: number) => void }) {
  const reduire = useReducedMotion();
  const classeBouton =
    "grid size-11 place-items-center rounded-full text-nuit transition-colors hover:bg-white active:bg-white disabled:opacity-35 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-bleu";
  return (
    <div role="group" aria-labelledby="libelle-quantite" className="flex items-center gap-1 rounded-full bg-creme p-1 ring-1 ring-nuit/10">
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.max(1, quantite - 1))}
        disabled={quantite <= 1}
        aria-label="Diminuer la quantité"
        className={classeBouton}
      >
        <Minus className="size-4" strokeWidth={2.5} aria-hidden />
      </motion.button>
      <span className="relative grid h-11 w-10 place-items-center overflow-hidden font-display text-lg font-bold tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantite}
            initial={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduire ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            aria-live="polite"
          >
            {quantite}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.min(99, quantite + 1))}
        disabled={quantite >= 99}
        aria-label="Augmenter la quantité"
        className={classeBouton}
      >
        <Plus className="size-4" strokeWidth={2.5} aria-hidden />
      </motion.button>
    </div>
  );
}

function CarteInfo({
  icone,
  titre,
  texte,
  couleur,
}: {
  icone: ReactNode;
  titre: string;
  texte: string;
  couleur: "ciel" | "violet";
}) {
  return (
    <div className="group flex gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-nuit/5 transition-shadow duration-500 hover:shadow-[0_18px_36px_-20px_rgba(29,111,224,0.4)]">
      <span
        className={clsx(
          "grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-500 ease-[var(--ease-doux)] group-hover:-rotate-6 group-hover:scale-110",
          couleur === "ciel" ? "bg-ciel/15 text-sky-700" : "bg-bleu/10 text-bleu",
        )}
      >
        {icone}
      </span>
      <div>
        <p className="font-display font-semibold text-nuit">{titre}</p>
        <p className="mt-1 text-sm leading-snug text-nuit/65">{texte}</p>
      </div>
    </div>
  );
}
