"use client";

import Image from "next/image";
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
  cache: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
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
            <span className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.32em] text-gris-500">
              <span className="size-1.5 rounded-full bg-noir" aria-hidden />
              {categorie}
            </span>
          </motion.p>
        )}

        <motion.h1
          variants={variantesElement}
          className="mt-3 text-balance font-affiche text-5xl uppercase leading-[0.92] tracking-[0.01em] text-noir sm:text-6xl xl:text-7xl"
        >
          {produit.nom}
        </motion.h1>

        <motion.p variants={variantesElement} className="mt-3 text-pretty text-lg leading-relaxed text-noir/70">
          {accroche || "Qualité vérifiée, livré chez vous à Kinshasa et payé à la réception."}
        </motion.p>

        <motion.div variants={variantesElement} className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
          <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="sr-only">Prix : </span>
            {formatUSD(produit.prix)}
          </p>
          {produit.enStock ? (
            <span className="mb-1.5 inline-flex items-center gap-2 px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-noir ring-1 ring-inset ring-noir">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-noir opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-noir" />
              </span>
              En stock
            </span>
          ) : (
            <span className="mb-1.5 bg-noir px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white">
              Bientôt de retour
            </span>
          )}
        </motion.div>

        {/* Zone d'achat */}
        <motion.div
          ref={zoneAchat}
          variants={variantesElement}
          className="mt-8 bg-white p-4 ring-1 ring-gris-200 sm:p-5"
        >
          {produit.enStock ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <span id="libelle-quantite" className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-noir">
                  Quantité
                </span>
                <Stepper quantite={quantite} onChange={setQuantite} />
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-gris-200 pt-4">
                <span className="text-sm text-noir/60">Total articles</span>
                <span className="text-2xl font-extrabold text-noir" aria-live="polite">
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
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 bg-whatsapp px-6 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-noir transition-colors duration-300 hover:bg-whatsapp-fonce focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
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
              <p className="text-sm leading-relaxed text-noir/70">
                Ce produit revient très vite. Écrivez-nous pour être prévenu(e) ou réserver le vôtre.
              </p>
              <a
                href={lienQuestion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 bg-whatsapp px-6 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-noir transition-colors duration-300 hover:bg-whatsapp-fonce focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
              >
                <WhatsAppIcon className="size-5" />
                Me prévenir sur WhatsApp
              </a>
            </div>
          )}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-noir/55">
            <ShieldCheck className="size-3.5 text-noir" aria-hidden />
            Aucun paiement en ligne : vous payez à la livraison.
          </p>
        </motion.div>

        {/* Cartes infos */}
        <motion.div variants={variantesElement} className="mt-5 grid gap-3 sm:grid-cols-2">
          <CarteInfo
            icone={<Truck className="size-5" aria-hidden />}
            titre={`Livraison dès ${formatFC(boutique.livraison.prixMinFC)}`}
            texte="Partout à Kinshasa. Le prix exact dépend du trajet, confirmé sur WhatsApp."
          />
          <CarteInfo
            icone={<Banknote className="size-5" aria-hidden />}
            titre="Cash à la livraison"
            texte="Vous vérifiez votre colis, puis vous payez. Simple et sans risque."
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
          className="font-affiche text-3xl uppercase tracking-[0.02em] text-noir sm:text-4xl"
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
              className="flex items-start gap-3 bg-white/70 p-3.5 ring-1 ring-gris-200"
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
                className="bg-noir grid size-6 shrink-0 place-items-center text-white"
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </motion.span>
              <span className="pt-0.5 text-[15px] leading-snug text-noir/85">{point}</span>
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
          <h2 className="font-affiche text-3xl uppercase tracking-[0.02em] text-noir sm:text-4xl">Description</h2>
          {description ? (
            <div className="mt-4 space-y-4 text-pretty text-base leading-relaxed text-noir/75">
              {description.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-pretty text-base leading-relaxed text-noir/75">
              Vous voulez plus de détails sur ce produit (utilisation, taille, couleurs disponibles) ? Écrivez-nous
              sur WhatsApp, nous vous répondons rapidement avec photos et conseils.
            </p>
          )}
          <a
            href={lienQuestion}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-noir focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir"
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
                  className="border-t border-gris-200 bg-white/90 backdrop-blur-xl"
                  style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                  {/* pr : laisse la place au bouton WhatsApp flottant (bas à droite) */}
                  <div className="flex items-center gap-3 py-2.5 pl-4 pr-[5.25rem]">
                    {image && (
                      <div className="relative size-12 shrink-0 overflow-hidden bg-white ring-1 ring-gris-200">
                        <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-noir/65">
                        {quantite > 1 ? `${quantite} × ` : ""}
                        {produit.nom}
                      </p>
                      <p className="font-display text-lg font-bold leading-tight text-noir">{formatUSD(total)}</p>
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
    "grid size-11 place-items-center text-noir transition-colors hover:bg-white active:bg-white disabled:opacity-35 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-noir";
  return (
    <div role="group" aria-labelledby="libelle-quantite" className="flex items-center gap-1 bg-gris-50 p-1 ring-1 ring-gris-200">
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

function CarteInfo({ icone, titre, texte }: { icone: ReactNode; titre: string; texte: string }) {
  return (
    <div className="group flex gap-3.5 bg-gris-50 p-4">
      <span className="grid size-11 shrink-0 place-items-center bg-noir text-white transition-transform duration-500 ease-[var(--ease-doux)] group-hover:-rotate-6 group-hover:scale-110">
        {icone}
      </span>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-noir">{titre}</p>
        <p className="mt-1 text-sm leading-snug text-noir/65">{texte}</p>
      </div>
    </div>
  );
}
