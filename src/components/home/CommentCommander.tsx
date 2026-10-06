"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Banknote, Check, CheckCheck, MousePointerClick, ShoppingBag, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { boutique, getProduit } from "@/lib/catalogue";
import { formatFC, formatUSD } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useProgression } from "@/components/animations/useProgression";
import { useMonte } from "@/lib/useMonte";

type Ton = "noir" | "gris" | "blanc";
type Etape = { titre: string; texte: string; Icone: LucideIcon | typeof WhatsAppIcon; ton: Ton };

const etapes: Etape[] = [
  {
    titre: "Choisissez vos produits",
    texte: "Parcourez la boutique et trouvez ce qui vous plaît : bien-être, beauté, accessoires.",
    Icone: MousePointerClick,
    ton: "noir",
  },
  {
    titre: "Ajoutez au panier",
    texte: "Un clic suffit. Votre panier est gardé sur votre téléphone, même si vous revenez plus tard.",
    Icone: ShoppingBag,
    ton: "gris",
  },
  {
    titre: "Envoyez sur WhatsApp",
    texte: "Votre commande est écrite pour vous. Il ne reste qu’à appuyer sur « Envoyer ».",
    Icone: WhatsAppIcon,
    ton: "blanc",
  },
  {
    titre: "Payez à la livraison",
    texte: `Livraison partout à Kinshasa dès ${formatFC(boutique.livraison.prixMinFC)}. Vous payez cash en recevant le colis.`,
    Icone: Banknote,
    ton: "noir",
  },
];

const TONS: Record<Ton, { carte: string; numero: string; icone: string; texte: string }> = {
  noir: { carte: "bg-noir text-white", numero: "texte-contour-blanc", icone: "bg-white text-noir", texte: "text-white/70" },
  gris: { carte: "bg-gris-100 text-noir", numero: "texte-contour", icone: "bg-noir text-white", texte: "text-gris-700" },
  blanc: { carte: "bg-white text-noir ring-2 ring-inset ring-noir", numero: "text-noir", icone: "bg-noir text-white", texte: "text-gris-700" },
};

/* Message d'exemple construit à partir du vrai catalogue. */
const exemple = [getProduit("montre-arabe"), getProduit("lunettes-chromees")].filter(
  (p): p is NonNullable<typeof p> => Boolean(p),
);
const totalExemple = exemple.reduce((t, p) => t + p.prix, 0);
const messageExemple = [
  `Bonjour ${boutique.nom} 👋`,
  "Je souhaite commander :",
  ...exemple.map((p) => `• 1 × ${p.nom} = ${formatUSD(p.prix)}`),
  `Sous-total : ${formatUSD(totalExemple)}`,
  "Commune : Gombe",
].join("\n");

const ease = [0.22, 1, 0.36, 1] as const;

export function CommentCommander() {
  const pile = useRef<HTMLOListElement>(null);
  const p = useProgression(pile, ["start start", "end end"], false);

  return (
    <section id="comment-commander" aria-labelledby="titre-comment-commander" className="relative overflow-x-clip bg-white pt-24 sm:pt-32">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500">— Simple comme bonjour</p>
          <h2
            id="titre-comment-commander"
            className="mt-3 font-affiche text-[16vw] uppercase leading-[0.86] tracking-[0.01em] sm:text-8xl lg:text-9xl"
          >
            Commander <br />
            en <span className="texte-contour [-webkit-text-stroke-width:2px]">4 étapes</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gris-700 sm:text-lg">
            Pas de compte, pas de carte bancaire. Vous choisissez, vous envoyez sur WhatsApp, on vous livre.
          </p>
        </Reveal>
      </Container>

      {/* Cartes qui s'empilent : chacune se fige puis recule quand la suivante arrive */}
      <ol ref={pile} className="relative mt-4">
        {etapes.map((etape, i) => (
          <CarteEtape key={etape.titre} etape={etape} index={i} total={etapes.length} progression={p} />
        ))}
      </ol>

      {/* Démonstration WhatsApp */}
      <Container className="pb-24 pt-10 sm:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500">— Sur WhatsApp</p>
            <h3 className="mt-3 font-affiche text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
              Votre message est <span className="texte-contour [-webkit-text-stroke-width:1.5px]">déjà prêt</span>
            </h3>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-gris-700 sm:text-lg">
              En appuyant sur « Commander sur WhatsApp », la liste de vos articles et le total s’écrivent
              automatiquement. Vous vérifiez, vous envoyez, et nous vous confirmons le prix de la livraison.
            </p>
            <ul className="mt-6 space-y-3 text-gris-900">
              {[
                "Réponse rapide de notre équipe",
                `Livraison partout à Kinshasa dès ${formatFC(boutique.livraison.prixMinFC)}`,
                "Paiement cash à la réception",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-noir text-white">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/boutique/" className="group">
                Voir la boutique
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/infos/" variante="secondaire">
                <Truck className="size-4" aria-hidden />
                Livraison &amp; paiement
              </ButtonLink>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <ChatDemo />
          </div>
        </div>
      </Container>
    </section>
  );
}

function CarteEtape({
  etape,
  index,
  total,
  progression,
}: {
  etape: Etape;
  index: number;
  total: number;
  progression: MotionValue<number>;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Arrivée : la carte monte en pivotant, de plus en plus fort d'une étape à l'autre.
  const arrivee = useProgression(ref, ["start end", "start start"], false, 1);
  const rotation = useTransform(arrivee, [0, 1], [(index % 2 ? 1 : -1) * (6 + index * 3), 0]);
  const iconeEchelle = useTransform(arrivee, [0.4, 1], [0.3, 1]);
  const iconeRotation = useTransform(arrivee, [0.4, 1], [-90, 0]);
  // Départ : quand les suivantes arrivent, elle recule et s'assombrit légèrement.
  const echelleCible = 1 - (total - 1 - index) * 0.05;
  const echelle = useTransform(progression, [index / total, 1], [1, echelleCible]);
  const voile = useTransform(progression, [index / total, 1], [0, index === total - 1 ? 0 : 0.35]);
  const ton = TONS[etape.ton];

  return (
    <li ref={ref} className="sticky top-0 flex h-[100svh] items-center justify-center px-4 sm:px-6">
      <motion.div
        style={{ scale: echelle, rotate: rotation, top: `calc(-6svh + ${index * 22}px)` }}
        className={`relative flex h-[min(66svh,540px)] w-full max-w-5xl origin-top flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-14 ${ton.carte}`}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            aria-hidden="true"
            className={`font-affiche text-[34vw] leading-[0.8] [-webkit-text-stroke-width:2px] sm:text-[12rem] lg:text-[15rem] ${ton.numero}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <motion.span
            style={{ scale: iconeEchelle, rotate: iconeRotation }}
            className={`grid size-16 shrink-0 place-items-center sm:size-20 ${ton.icone}`}
          >
            <etape.Icone className="size-7 sm:size-9" aria-hidden />
          </motion.span>
        </div>
        <div className="max-w-2xl">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.38em] opacity-60">Étape {index + 1} / {total}</p>
          <h3 className="mt-3 font-affiche text-4xl uppercase leading-[0.92] sm:text-6xl lg:text-7xl">{etape.titre}</h3>
          <p className={`mt-4 max-w-lg text-[0.95rem] leading-relaxed sm:text-lg ${ton.texte}`}>{etape.texte}</p>
        </div>
        <motion.div aria-hidden="true" style={{ opacity: voile }} className="pointer-events-none absolute inset-0 bg-noir" />
      </motion.div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Faux écran WhatsApp : le message se tape tout seul.                 */
/* ------------------------------------------------------------------ */

type Phase = "attente" | "frappe" | "envoye" | "reponse";

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "-120px" });
  const reduire = useReducedMotion();
  const [nbCar, setNbCar] = useState(0);
  const [phase, setPhase] = useState<Phase>("attente");

  // Version immobile seulement après l'hydratation : le HTML serveur et le premier rendu client restent identiques.
  const monte = useMonte();
  const immobile = monte && !!reduire;
  const texteAffiche = immobile ? messageExemple : messageExemple.slice(0, nbCar);
  const phaseAffichee: Phase = immobile ? "reponse" : phase;

  useEffect(() => {
    if (!visible || reduire) return;
    const minuteurs: ReturnType<typeof setTimeout>[] = [];
    let intervalle: ReturnType<typeof setInterval> | undefined;
    const caracteres = Array.from(messageExemple);

    minuteurs.push(
      setTimeout(() => {
        setPhase("frappe");
        let n = 0;
        intervalle = setInterval(() => {
          n += 2;
          // Avancer en unités de code (gère les emojis sur 2 unités)
          const longueur = caracteres.slice(0, n).join("").length;
          setNbCar(longueur);
          if (n >= caracteres.length) {
            if (intervalle) clearInterval(intervalle);
            minuteurs.push(setTimeout(() => setPhase("envoye"), 450));
            minuteurs.push(setTimeout(() => setPhase("reponse"), 1900));
          }
        }, 28);
      }, 500),
    );

    return () => {
      minuteurs.forEach(clearTimeout);
      if (intervalle) clearInterval(intervalle);
    };
  }, [visible, reduire]);

  const envoye = phaseAffichee === "envoye" || phaseAffichee === "reponse";

  return (
    <motion.div
      ref={ref}
      initial={reduire ? false : { opacity: 0, y: 120, rotate: -10, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease }}
      className="relative mx-auto w-full max-w-sm"
    >
      <figure className="relative overflow-hidden rounded-[2.4rem] bg-[#efeae2] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-[10px] ring-noir">
        {/* Barre de conversation */}
        <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-noir font-affiche text-sm tracking-wide text-white ring-2 ring-white/80">
            JW
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{boutique.nom}</p>
            <p className="text-xs text-white/75">
              {phaseAffichee === "envoye" ? "en train d’écrire…" : "en ligne"}
            </p>
          </div>
          <WhatsAppIcon className="h-5 w-5 opacity-90" />
        </div>

        {/* Messages */}
        <div className="flex min-h-[22rem] flex-col justify-end gap-3 px-3 py-4 sm:px-4">
          <p className="sr-only">Exemple de message envoyé : {messageExemple}</p>

          <AnimatePresence>
            {phaseAffichee !== "attente" && (
              <motion.div
                key="client"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                aria-hidden
                className="relative ml-auto max-w-[88%] origin-bottom-right rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[0.84rem] leading-snug text-[#111b21] shadow-sm"
              >
                <p className="whitespace-pre-wrap break-words">
                  {texteAffiche}
                  {phaseAffichee === "frappe" && (
                    <motion.span
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#128c7e]"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}
                </p>
                <span className="mt-1 flex items-center justify-end gap-1 text-[0.68rem] text-[#667781]">
                  10:24
                  <AnimatePresence mode="wait" initial={false}>
                    {envoye ? (
                      <motion.span
                        key="lu"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[#53bdeb]"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span key="att" exit={{ scale: 0 }}>
                        <Check className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.div>
            )}

            {phaseAffichee === "envoye" && (
              <motion.div
                key="saisie"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                aria-hidden
                className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm"
              >
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-2 w-2 rounded-full bg-[#667781]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </motion.div>
            )}

            {phaseAffichee === "reponse" && (
              <motion.div
                key="reponse"
                initial={reduire ? false : { opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="max-w-[85%] origin-bottom-left rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[0.84rem] leading-snug text-[#111b21] shadow-sm"
              >
                <p>
                  Merci ! 🙏 Commande bien reçue. Livraison à Gombe aujourd’hui, paiement cash à la réception. 🚚
                </p>
                <span className="mt-1 block text-right text-[0.68rem] text-[#667781]">10:25</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Barre de saisie */}
        <div aria-hidden className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2.5">
          <div className="flex-1 rounded-full bg-white px-4 py-2 text-sm text-[#667781]">Message</div>
          <motion.div
            animate={phaseAffichee === "frappe" && !reduire ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: phaseAffichee === "frappe" ? Infinity : 0 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] text-white"
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </div>
        <figcaption className="sr-only">
          Illustration : le message de commande pré-rempli envoyé sur WhatsApp et la réponse de la boutique.
        </figcaption>
      </figure>
    </motion.div>
  );
}
