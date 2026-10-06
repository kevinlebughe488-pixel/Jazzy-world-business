"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowRight, Banknote, Check, CheckCheck, MousePointerClick, ShoppingBag, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { boutique, getProduit } from "@/lib/catalogue";
import { formatFC, formatUSD } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Etape = { titre: string; texte: string; Icone: LucideIcon | typeof WhatsAppIcon; accent: string };

const etapes: Etape[] = [
  {
    titre: "Choisissez vos produits",
    texte: "Parcourez la boutique et trouvez ce qui vous plaît : bien-être, beauté, accessoires.",
    Icone: MousePointerClick,
    accent: "from-bleu to-nuit-700",
  },
  {
    titre: "Ajoutez au panier",
    texte: "Un clic suffit. Votre panier est gardé sur votre téléphone, même si vous revenez plus tard.",
    Icone: ShoppingBag,
    accent: "from-nuit-700 to-bleu",
  },
  {
    titre: "Envoyez sur WhatsApp",
    texte: "Votre commande est écrite pour vous. Il ne reste qu’à appuyer sur « Envoyer ».",
    Icone: WhatsAppIcon,
    accent: "from-whatsapp to-[#128c7e]",
  },
  {
    titre: "Payez à la livraison",
    texte: `Livraison partout à Kinshasa dès ${formatFC(boutique.livraison.prixMinFC)}. Vous payez cash en recevant le colis.`,
    Icone: Banknote,
    accent: "from-ciel to-nuit-700",
  },
];

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

const varianteEtape: Variants = {
  cache: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.12 * i, ease } }),
};

const variantePastille: Variants = {
  cache: { scale: 0, rotate: -45 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 320, damping: 16, delay: 0.12 * i + 0.15 },
  }),
};

export function CommentCommander() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduire = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 85%", "end 55%"] });
  const progression = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const echelle = reduire ? 1 : progression;

  return (
    <section
      id="comment-commander"
      aria-labelledby="titre-comment-commander"
      className="relative overflow-hidden bg-creme py-20 sm:py-28"
    >
      {/* Halos décoratifs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-bleu/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-ciel/15 blur-3xl" />
      </div>

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-bleu shadow-sm ring-1 ring-bleu/15">
            <span className="h-1.5 w-1.5 rounded-full bg-bleu" aria-hidden />
            Simple comme bonjour
          </p>
          <h2
            id="titre-comment-commander"
            className="mt-5 font-display text-3xl font-bold text-nuit sm:text-4xl lg:text-5xl"
          >
            Commander en <span className="texte-degrade">4 étapes</span>
          </h2>
          <p className="mt-4 text-base text-nuit/70 sm:text-lg">
            Pas de compte, pas de carte bancaire. Vous choisissez, vous envoyez sur WhatsApp, on vous livre.
          </p>
        </Reveal>

        {/* Frise chronologique */}
        <div ref={sectionRef} className="relative mt-14 lg:mt-20">
          {/* Ligne horizontale (desktop) */}
          <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-1 rounded-full bg-nuit/10 lg:block">
            <motion.div
              className="degrade-marque h-full origin-left rounded-full"
              style={{ scaleX: echelle }}
            />
          </div>
          {/* Ligne verticale (mobile) */}
          <div aria-hidden className="absolute bottom-8 left-8 top-8 w-1 -translate-x-1/2 rounded-full bg-nuit/10 lg:hidden">
            <motion.div
              className="h-full w-full origin-top rounded-full bg-gradient-to-b from-bleu via-nuit-700 to-ciel"
              style={{ scaleY: echelle }}
            />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {etapes.map((etape, i) => (
              <motion.li
                key={etape.titre}
                custom={i}
                variants={varianteEtape}
                initial={reduire ? false : "cache"}
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="group relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
              >
                <div className="relative shrink-0">
                  <motion.div
                    custom={i}
                    variants={variantePastille}
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${etape.accent} text-white shadow-lg shadow-nuit/20 ring-4 ring-creme transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3`}
                  >
                    <etape.Icone className="h-7 w-7" aria-hidden />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-nuit shadow-md ring-1 ring-nuit/10">
                      {i + 1}
                    </span>
                  </motion.div>
                </div>

                <div className="flex-1 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-nuit/5 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-bleu/10 lg:mt-7 lg:w-full lg:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bleu">Étape {i + 1}</p>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-nuit sm:text-xl">{etape.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-nuit/70 sm:text-[0.95rem]">{etape.texte}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Démonstration WhatsApp */}
        <div className="mt-20 grid items-center gap-12 lg:mt-28 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <h3 className="font-display text-2xl font-bold text-nuit sm:text-3xl">
              Votre message est <span className="texte-degrade">déjà prêt</span>
            </h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-nuit/70 sm:text-lg">
              En appuyant sur « Commander sur WhatsApp », la liste de vos articles et le total s’écrivent
              automatiquement. Vous vérifiez, vous envoyez, et nous vous confirmons le prix de la livraison.
            </p>
            <ul className="mt-6 space-y-3 text-nuit/80">
              {[
                "Réponse rapide de notre équipe",
                `Livraison partout à Kinshasa dès ${formatFC(boutique.livraison.prixMinFC)}`,
                "Paiement cash à la réception",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-whatsapp/15 text-[#128c7e]">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/boutique/" className="min-h-12">
                Voir la boutique
                <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/infos/" variante="secondaire" className="min-h-12">
                <Truck className="h-5 w-5" aria-hidden />
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

  const texteAffiche = reduire ? messageExemple : messageExemple.slice(0, nbCar);
  const phaseAffichee: Phase = reduire ? "reponse" : phase;

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
      initial={reduire ? false : { opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease }}
      className="relative mx-auto w-full max-w-sm"
    >
      {/* Lueur */}
      <div aria-hidden className="degrade-marque absolute -inset-6 rounded-[3rem] opacity-25 blur-3xl" />

      <figure className="relative overflow-hidden rounded-[2rem] bg-[#efeae2] shadow-2xl shadow-nuit/25 ring-1 ring-nuit/10">
        {/* Barre de conversation */}
        <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/globe.webp" alt="" width={40} height={40} className="h-full w-full object-contain" />
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
