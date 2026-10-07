"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Check, MessageCircle, Minus, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { boutique, type Produit } from "@/lib/catalogue";
import { formatFC, formatUSD } from "@/lib/format";
import { useMonte } from "@/lib/useMonte";
import { lienWhatsApp, messageCommande, messageQuestion } from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;

const conteneur: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const element: Variants = {
  cache: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const POINTS_PAR_DEFAUT = [
  "Produit vérifié avant chaque livraison",
  "Livraison partout à Kinshasa",
  "Vous payez cash à la réception",
  "Conseils et suivi sur WhatsApp",
];

const boutonWhatsApp =
  "inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 text-base font-medium text-encre transition-[background-color,transform] duration-300 hover:bg-whatsapp-fonce active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre";

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
      <motion.div className="flex flex-col" variants={variantesConteneur} initial="cache" animate="visible">
        {categorie && (
          <motion.p variants={variantesElement} className="etiquette">
            {categorie}
          </motion.p>
        )}

        <motion.h1
          variants={variantesElement}
          className="mt-3 font-serif text-5xl leading-[1] tracking-[-0.015em] sm:text-6xl xl:text-7xl"
        >
          {produit.nom}
        </motion.h1>

        <motion.p variants={variantesElement} className="mt-4 text-lg leading-relaxed text-encre-doux">
          {accroche || "Qualité vérifiée, livré chez vous à Kinshasa et payé à la réception."}
        </motion.p>

        <motion.div variants={variantesElement} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="font-serif text-5xl leading-none">
            <span className="sr-only">Prix : </span>
            {formatUSD(produit.prix)}
          </p>
          {produit.enStock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sauge-pale px-3 py-1 text-sm text-sauge-fonce">
              <Check className="size-3.5" strokeWidth={2.6} aria-hidden />
              En stock
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-argile/10 px-3 py-1 text-sm text-argile-fonce">
              Bientôt de retour
            </span>
          )}
        </motion.div>

        {/* Zone d'achat */}
        <motion.div ref={zoneAchat} variants={variantesElement} className="mt-8 rounded-carte bg-carte p-4 shadow-doux sm:p-6">
          {produit.enStock ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <span id="libelle-quantite" className="font-medium">
                  Quantité
                </span>
                <Stepper quantite={quantite} onChange={setQuantite} />
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-trait-fort pt-4">
                <span className="text-muet">Total articles</span>
                <span className="font-serif text-3xl leading-none" aria-live="polite">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={total}
                      className="inline-block"
                      initial={reduire ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduire ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {formatUSD(total)}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-2.5">
                <AddToCartButton produitId={produit.id} quantite={quantite} image={image} className="w-full" />
                <a href={lienCommande} target="_blank" rel="noopener noreferrer" className={boutonWhatsApp}>
                  <WhatsAppIcon className="size-5" />
                  Commander sur WhatsApp
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="leading-relaxed text-encre-doux">
                Ce produit revient très vite. Écrivez-nous pour être prévenu(e) ou réserver le vôtre.
              </p>
              <a href={lienQuestion} target="_blank" rel="noopener noreferrer" className={boutonWhatsApp}>
                <WhatsAppIcon className="size-5" />
                Me prévenir sur WhatsApp
              </a>
            </div>
          )}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-muet">
            <ShieldCheck className="size-4 text-sauge-fonce" aria-hidden />
            Aucun paiement en ligne : vous payez à la livraison.
          </p>
        </motion.div>

        {/* Livraison & paiement */}
        <motion.dl variants={variantesElement} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-carte bg-lin p-5">
            <dt className="font-medium">Livraison dès {formatFC(boutique.livraison.prixMinFC)}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-encre-doux">
              Partout à Kinshasa. Le prix exact dépend du trajet, confirmé sur WhatsApp.
            </dd>
          </div>
          <div className="rounded-carte bg-lin p-5">
            <dt className="font-medium">Cash à la livraison</dt>
            <dd className="mt-1 text-sm leading-relaxed text-encre-doux">
              Vous vérifiez votre colis, puis vous payez. Simple et sans risque.
            </dd>
          </div>
        </motion.dl>
      </motion.div>

      {/* Points forts & description */}
      <div className="mt-14 border-t border-trait pt-10">
        <h2 className="font-serif text-4xl leading-none">{points.length > 0 ? "Points forts" : "Pourquoi commander chez nous"}</h2>
        <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {pointsAffiches.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sauge-pale text-sauge-fonce">
                <Check className="size-3.5" strokeWidth={2.6} aria-hidden />
              </span>
              <span className="leading-snug text-encre-doux">{point}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-serif text-4xl leading-none">Description</h2>
        {description ? (
          <div className="mt-5 max-w-[65ch] space-y-4 leading-relaxed text-encre-doux">
            {description.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-5 max-w-[65ch] leading-relaxed text-encre-doux">
            Vous voulez plus de détails sur ce produit (utilisation, taille, couleurs disponibles) ? Écrivez-nous sur
            WhatsApp, nous vous répondons rapidement avec photos et conseils.
          </p>
        )}
        <a
          href={lienQuestion}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full font-medium text-encre underline decoration-trait-fort underline-offset-[6px] transition-colors hover:decoration-encre focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre"
        >
          <MessageCircle className="size-4" aria-hidden />
          Poser une question sur ce produit
        </a>
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
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
                className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
              >
                <div
                  className="border-t border-trait bg-papier/90 backdrop-blur-xl"
                  style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                  {/* pr : laisse la place au bouton WhatsApp flottant (bas à droite) */}
                  <div className="flex items-center gap-3 py-2.5 pl-4 pr-[5.25rem]">
                    {image && (
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-lin">
                        <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-muet">
                        {quantite > 1 ? `${quantite} × ` : ""}
                        {produit.nom}
                      </p>
                      <p className="font-serif text-2xl leading-tight">{formatUSD(total)}</p>
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
    "grid size-10 place-items-center rounded-full text-encre transition-colors hover:bg-carte disabled:opacity-35 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-encre";
  return (
    <div role="group" aria-labelledby="libelle-quantite" className="flex items-center gap-1 rounded-full bg-papier p-1 ring-1 ring-inset ring-trait">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantite - 1))}
        disabled={quantite <= 1}
        aria-label="Diminuer la quantité"
        className={classeBouton}
      >
        <Minus className="size-4" strokeWidth={2.2} aria-hidden />
      </button>
      <span className="relative grid h-10 w-9 place-items-center overflow-hidden text-lg font-medium tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantite}
            initial={reduire ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduire ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
          >
            {quantite}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, quantite + 1))}
        disabled={quantite >= 99}
        aria-label="Augmenter la quantité"
        className={classeBouton}
      >
        <Plus className="size-4" strokeWidth={2.2} aria-hidden />
      </button>
    </div>
  );
}
