"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { Banknote, MessageCircle, ShieldCheck, Sparkles, Truck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { boutique, produits } from "@/lib/catalogue";

type Avantage = {
  icone: LucideIcon;
  titre: string;
  texte: string;
  tuile: string;
  halo: string;
  compteur?: number;
};

const avantages: Avantage[] = [
  {
    icone: Truck,
    titre: "Livraison partout à Kinshasa",
    texte: `${boutique.livraison.zone}, de Gombe à Masina. Le prix dépend du trajet et vous est confirmé sur WhatsApp.`,
    tuile: "from-violet to-nuit-700",
    halo: "rgba(123, 63, 179, 0.22)",
    compteur: boutique.livraison.prixMinFC,
  },
  {
    icone: Banknote,
    titre: "Paiement cash à la livraison",
    texte: "Vous payez uniquement quand le colis est entre vos mains. Aucun paiement à l’avance, zéro risque.",
    tuile: "from-nuit-700 to-ciel",
    halo: "rgba(79, 195, 232, 0.25)",
  },
  {
    icone: MessageCircle,
    titre: "Commande simple sur WhatsApp",
    texte: "Ajoutez vos articles au panier, envoyez-le en un clic : on vous répond rapidement pour tout organiser.",
    tuile: "from-[#1ebe5d] to-whatsapp",
    halo: "rgba(37, 211, 102, 0.22)",
  },
  {
    icone: ShieldCheck,
    titre: "Produits sélectionnés avec soin",
    texte: "Bien-être, beauté, accessoires : chaque article est choisi pour sa qualité et son utilité au quotidien.",
    tuile: "from-violet via-nuit-700 to-ciel",
    halo: "rgba(180, 138, 224, 0.28)",
  },
];

const grille: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const carte: Variants = {
  cache: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const formateurFC = new Intl.NumberFormat("fr-FR");

function Compteur({ valeur }: { valeur: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const reduit = useReducedMotion();
  const [affiche, setAffiche] = useState(0);

  useEffect(() => {
    if (!visible || reduit) return;
    const controles = animate(0, valeur, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAffiche(Math.round(v / 100) * 100),
    });
    return () => controles.stop();
  }, [visible, reduit, valeur]);

  return (
    <span ref={ref} className="tabular-nums">
      {/* Valeur finale lisible par les lecteurs d’écran, le compteur est décoratif */}
      <span className="sr-only">{formateurFC.format(valeur)} FC</span>
      <span aria-hidden="true">{formateurFC.format(reduit ? valeur : affiche)} FC</span>
    </span>
  );
}

function CarteAvantage({ avantage, index }: { avantage: Avantage; index: number }) {
  const reduit = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const lueur = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, ${avantage.halo}, transparent 65%)`;
  const Icone = avantage.icone;

  function bouger(e: PointerEvent<HTMLDivElement>) {
    if (reduit || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function quitter() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.li variants={carte} className="[perspective:1000px]">
      <motion.div
        onPointerMove={bouger}
        onPointerLeave={quitter}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduit ? undefined : { y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="group relative h-full overflow-hidden rounded-carte bg-white p-6 shadow-[0_1px_2px_rgba(36,26,82,0.04),0_12px_32px_-12px_rgba(36,26,82,0.12)] ring-1 ring-nuit/5 transition-shadow duration-500 hover:shadow-[0_2px_4px_rgba(36,26,82,0.05),0_28px_60px_-20px_rgba(123,63,179,0.35)] sm:p-7"
      >
        {/* Lueur qui suit le curseur */}
        <motion.div
          aria-hidden="true"
          style={{ background: lueur }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-4 font-display text-8xl font-black text-nuit/[0.04] select-none"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <div
            className={`inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${avantage.tuile} text-white shadow-lg shadow-nuit/20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-rotate-6`}
          >
            <Icone className="size-7" strokeWidth={1.8} aria-hidden="true" />
          </div>

          <h3 className="mt-5 text-lg font-semibold leading-snug text-nuit sm:text-xl">{avantage.titre}</h3>

          {avantage.compteur !== undefined && (
            <p className="mt-2 font-display text-2xl font-bold">
              <span className="text-sm font-medium text-nuit/60">dès </span>
              <span className="texte-degrade">
                <Compteur valeur={avantage.compteur} />
              </span>
            </p>
          )}

          <p className="mt-2 text-[0.95rem] leading-relaxed text-nuit/70">{avantage.texte}</p>
        </div>
      </motion.div>
    </motion.li>
  );
}

const motsCles = [
  ...produits.map((p) => p.nom),
  "Livraison à Kinshasa",
  "Cash à la livraison",
  "Commande WhatsApp",
];

function Defilement() {
  const reduit = useReducedMotion();
  const liste = (cle: string, cache: boolean) => (
    <ul className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10" aria-hidden={cache || undefined}>
      {motsCles.map((mot) => (
        <li key={`${cle}-${mot}`} className="flex items-center gap-6 sm:gap-10">
          <span className="whitespace-nowrap font-display text-xl font-semibold text-nuit/80 sm:text-2xl">{mot}</span>
          <Sparkles className="size-5 shrink-0 text-violet-300" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative mt-16 overflow-hidden border-y border-nuit/5 bg-white/60 py-5 sm:mt-20 sm:py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <p className="sr-only">Nos produits et services : {motsCles.join(", ")}.</p>
      <motion.div
        aria-hidden="true"
        className="flex w-max will-change-transform"
        animate={reduit ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {liste("a", true)}
        {liste("b", true)}
      </motion.div>
    </div>
  );
}

export function Avantages() {
  return (
    <section aria-labelledby="titre-avantages" className="relative overflow-hidden py-20 sm:py-28">
      {/* Halos décoratifs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 size-80 rounded-full bg-violet/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-24 size-96 rounded-full bg-ciel/15 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet/10 px-4 py-1.5 text-sm font-semibold text-violet">
              <Sparkles className="size-4" aria-hidden="true" />
              Pourquoi Jazzy World
            </span>
          </Reveal>
          <Reveal delai={0.08}>
            <h2 id="titre-avantages" className="mt-4 text-3xl font-bold text-nuit sm:text-4xl lg:text-5xl">
              Acheter en ligne, <span className="texte-degrade">en toute confiance</span>
            </h2>
          </Reveal>
          <Reveal delai={0.16}>
            <p className="mt-4 text-base leading-relaxed text-nuit/70 sm:text-lg">
              Une boutique pensée pour Kinshasa : on vous livre, vous vérifiez, puis vous payez.
            </p>
          </Reveal>
        </div>

        <motion.ul
          variants={grille}
          initial="cache"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {avantages.map((a, i) => (
            <CarteAvantage key={a.titre} avantage={a} index={i} />
          ))}
        </motion.ul>
      </Container>

      <Defilement />
    </section>
  );
}
