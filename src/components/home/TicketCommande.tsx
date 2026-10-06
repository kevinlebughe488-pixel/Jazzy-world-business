"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useProgression } from "@/components/animations/useProgression";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";

const ETAPES = [
  { titre: "Choisissez vos produits", texte: "Parcourez la boutique : bien-être, beauté, accessoires." },
  { titre: "Ajoutez au panier", texte: "Un clic suffit. Votre panier reste gardé sur votre téléphone." },
  { titre: "Envoyez sur WhatsApp", texte: "Votre commande est déjà écrite : il ne reste qu’à appuyer sur « Envoyer »." },
  {
    titre: "Payez à la livraison",
    texte: `On vous livre partout à Kinshasa dès ${formatFC(boutique.livraison.prixMinFC)}. Vous payez cash en recevant le colis.`,
  },
];

/* Le papier sort de la fente entre ces deux moments du défilement. */
const DEBUT_IMPRESSION = 0.04;
const FIN_IMPRESSION = 0.84;

/* Code-barres décoratif (largeurs fixes : identique au serveur et au navigateur). */
const BARRES = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3];

/**
 * « Commander en 4 étapes » sous forme de ticket de caisse : une imprimante noire
 * imprime le ticket au fil du défilement, ligne après ligne. L'étape en cours
 * d'impression est surlignée, puis un tampon « Payé cash » vient frapper le ticket.
 */
export function TicketCommande() {
  const section = useRef<HTMLElement>(null);
  const papier = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();
  // Animations réduites : ticket entièrement imprimé et tamponné (progression figée à 1).
  const p = useProgression(section, ["start start", "end end"], true, 1);

  const y = useTransform(p, [DEBUT_IMPRESSION, FIN_IMPRESSION], ["0%", "-100%"]);
  const indiceOpacite = useTransform(p, [0, DEBUT_IMPRESSION + 0.06], [1, 0]);
  const tamponEchelle = useTransform(p, [0.86, 0.93], [3.2, 1]);
  const tamponOpacite = useTransform(p, [0.86, 0.9], [0, 0.9]);
  const tamponRotation = useTransform(p, [0.86, 0.93], [-34, -11]);
  // Petite secousse du ticket à l'impact du tampon.
  const secousse = useTransform(p, [0.92, 0.935, 0.95, 0.965], [0, 6, -4, 0]);

  // Position (en fraction de la hauteur du ticket) où chaque étape finit de sortir de la fente.
  const seuils = useRef<number[]>([0.3, 0.45, 0.6, 0.75]);
  useEffect(() => {
    const el = papier.current;
    if (!el) return;
    const mesurer = () => {
      const h = el.offsetHeight || 1;
      seuils.current = [...el.querySelectorAll<HTMLElement>("[data-etape]")].map(
        (ligne) => (ligne.offsetTop + ligne.offsetHeight * 0.7) / h,
      );
    };
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  const [etape, setEtape] = useState(-1);
  useMotionValueEvent(p, "change", (v) => {
    const sorti = (v - DEBUT_IMPRESSION) / (FIN_IMPRESSION - DEBUT_IMPRESSION);
    let n = -1;
    seuils.current.forEach((s, i) => {
      if (sorti >= s) n = i;
    });
    setEtape(n);
  });

  return (
    <section
      ref={section}
      id="comment-commander"
      aria-labelledby="titre-comment-commander"
      className="relative h-[310svh] bg-gris-100 motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden motion-reduce:relative motion-reduce:h-auto">
        <Container className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-3 pt-24 lg:grid-cols-[1fr_auto] lg:grid-rows-1 lg:items-center lg:gap-16 lg:pt-20">
          {/* ---------- Texte ---------- */}
          <div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500">— Simple comme bonjour</p>
            <h2
              id="titre-comment-commander"
              className="mt-2 font-affiche text-[12vw] uppercase leading-[0.88] tracking-[0.01em] sm:text-7xl lg:mt-3 lg:text-8xl xl:text-9xl"
            >
              Commander <br className="hidden lg:block" />
              en <span className="texte-contour whitespace-nowrap [-webkit-text-stroke-width:2px]">4 étapes</span>
            </h2>
            <p className="mt-5 hidden max-w-md text-lg leading-relaxed text-gris-700 lg:block">
              Pas de compte, pas de carte bancaire. Faites défiler : votre ticket s’imprime.
            </p>

            {/* Étape en cours (bureau) */}
            <div className="mt-10 hidden max-w-md lg:block" aria-hidden="true">
              <div className="flex gap-1.5">
                {ETAPES.map((e, i) => (
                  <span key={e.titre} className="h-1 flex-1 bg-gris-300">
                    <span
                      className={clsx(
                        "block h-full origin-left bg-noir transition-transform duration-500 ease-[var(--ease-doux)]",
                        i <= etape ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                ))}
              </div>
              <div className="mt-6 flex min-h-36 items-start gap-6">
                <span className="relative block h-[7.5rem] w-[9rem] shrink-0 overflow-hidden font-affiche text-[8rem] leading-[0.95]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={etape}
                      className="absolute inset-0"
                      initial={reduit ? { opacity: 0 } : { y: "100%" }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={reduit ? { opacity: 0 } : { y: "-100%" }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {etape < 0 ? "00" : String(etape + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={etape}
                    initial={reduit ? { opacity: 0 } : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduit ? { opacity: 0 } : { opacity: 0, x: -24 }}
                    transition={{ duration: 0.35 }}
                    className="pt-2"
                  >
                    <p className="font-affiche text-4xl uppercase leading-[0.95]">
                      {etape < 0 ? "Impression…" : ETAPES[etape].titre}
                    </p>
                    <p className="mt-2 text-gris-700">
                      {etape < 0 ? "Continuez à défiler pour imprimer votre ticket." : ETAPES[etape].texte}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ---------- Imprimante + ticket ---------- */}
          <div className="relative mx-auto flex h-full w-[min(92vw,23rem)] flex-col pb-5 lg:h-[min(82svh,720px)] lg:w-[26rem] lg:pb-0">
            {/* Fenêtre au-dessus de la fente : le ticket y monte */}
            <div className="relative min-h-0 flex-1 overflow-hidden motion-reduce:overflow-visible">
              {/* Indication avant que le ticket sorte */}
              <motion.p
                aria-hidden="true"
                style={{ opacity: indiceOpacite }}
                className="absolute inset-x-0 bottom-6 text-center text-[0.66rem] font-bold uppercase tracking-[0.3em] text-gris-500 motion-reduce:hidden"
              >
                Faites défiler · votre ticket s’imprime ↓
              </motion.p>
              <motion.div
                ref={papier}
                style={{ y, x: secousse }}
                className="absolute inset-x-3 top-full motion-reduce:static motion-reduce:transform-none!"
              >
                {/* Bord déchiré (haut du ticket) */}
                <div
                  aria-hidden="true"
                  className="h-2.5 bg-[length:14px_10px] bg-repeat-x"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, transparent 50%, #fff 50%), linear-gradient(-45deg, transparent 50%, #fff 50%)",
                  }}
                />
                <div className="relative bg-white px-5 pb-6 pt-3 font-mono text-[0.68rem] uppercase leading-relaxed text-noir shadow-[0_24px_40px_-28px_rgba(0,0,0,0.5)] sm:text-[0.72rem] lg:text-[0.76rem]">
                  <p className="text-center text-[0.8rem] font-bold tracking-[0.18em]">{boutique.nom}</p>
                  <p className="text-center text-gris-500">Kinshasa · RD Congo</p>
                  <p className="text-center text-gris-500">WhatsApp {boutique.whatsappAffiche}</p>
                  <Pointilles />
                  <div className="flex justify-between">
                    <span>Ticket n° 243-0001</span>
                    <span>Caisse : WhatsApp</span>
                  </div>
                  <Pointilles />

                  <ol className="space-y-2">
                    {ETAPES.map((e, i) => {
                      const enCours = i === etape;
                      const fait = i <= etape;
                      return (
                        <li
                          key={e.titre}
                          data-etape
                          className={clsx(
                            "-mx-2 px-2 py-1.5 transition-colors duration-300",
                            enCours ? "bg-noir text-white" : "bg-transparent",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 font-bold">
                            <span>
                              {String(i + 1).padStart(2, "0")} {e.titre}
                            </span>
                            <motion.span
                              aria-hidden="true"
                              initial={false}
                              animate={fait ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -90, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 18 }}
                            >
                              ✓
                            </motion.span>
                          </div>
                          <p className={clsx("mt-0.5 normal-case", enCours ? "text-white/75" : "text-gris-700")}>{e.texte}</p>
                        </li>
                      );
                    })}
                  </ol>

                  <Pointilles />
                  <div className="relative space-y-1">
                    <LigneTotal libelle="Compte à créer" valeur="Aucun" />
                    <LigneTotal libelle="Paiement en ligne" valeur="0 $" />
                    <LigneTotal libelle="Livraison" valeur={`dès ${formatFC(boutique.livraison.prixMinFC)}`} />
                    <div className="mt-2 border-t-4 border-double border-noir pt-2">
                      <LigneTotal libelle="Total" valeur="Cash à la livraison" gras />
                    </div>

                    {/* Tampon */}
                    <motion.div
                      aria-hidden="true"
                      style={{ scale: tamponEchelle, opacity: tamponOpacite, rotate: tamponRotation }}
                      className="pointer-events-none absolute -top-4 right-0 border-[3px] border-noir px-3 py-1 text-center font-affiche leading-none text-noir mix-blend-multiply"
                    >
                      <span className="block text-3xl">Payé cash</span>
                      <span className="block text-[0.6rem] tracking-[0.3em]">à la livraison</span>
                    </motion.div>
                  </div>

                  <div aria-hidden="true" className="mx-auto mt-5 flex h-12 w-fit items-stretch gap-[2px]">
                    {BARRES.map((l, i) => (
                      <span key={i} className={i % 2 ? "bg-transparent" : "bg-noir"} style={{ width: l * 2 }} />
                    ))}
                  </div>
                  <p className="mt-3 text-center font-bold tracking-[0.2em]">Merci · Matondo mingi !</p>
                </div>
              </motion.div>
            </div>

            {/* Imprimante */}
            <div aria-hidden="true" className="relative z-10 h-24 shrink-0 bg-noir text-white shadow-[0_30px_40px_-25px_rgba(0,0,0,0.6)]">
              <span className="absolute inset-x-5 top-0 h-[3px] bg-gris-700" />
              <span className="absolute inset-x-5 top-[3px] h-px bg-black" />
              <div className="flex h-full items-end justify-between px-5 pb-4">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50">JWB · Caisse</span>
                <span className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50">
                  {etape < ETAPES.length - 1 ? "Impression" : "Prêt"}
                  <span
                    className={clsx(
                      "size-2 rounded-full bg-white",
                      etape < ETAPES.length - 1 && "motion-safe:animate-pulse",
                    )}
                  />
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function Pointilles() {
  return <p aria-hidden="true" className="my-2 overflow-hidden whitespace-nowrap text-gris-300">{"- ".repeat(40)}</p>;
}

function LigneTotal({ libelle, valeur, gras }: { libelle: string; valeur: string; gras?: boolean }) {
  return (
    <div className={clsx("flex items-baseline gap-2", gras && "text-[0.8rem] font-bold")}>
      <span className="shrink-0">{libelle}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-gris-300" />
      <span className="shrink-0 text-right">{valeur}</span>
    </div>
  );
}
