"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BandeauVitesse } from "@/components/animations/BandeauVitesse";
import { TexteRevele } from "@/components/animations/TexteRevele";
import { useProgression } from "@/components/animations/useProgression";
import { boutique } from "@/lib/catalogue";
import { useMonte } from "@/lib/useMonte";

const MOTS_BANDEAU = ["Livraison Kinshasa", "Cash à la livraison", "Commande WhatsApp", "Style & bien-être"];

type Avantage = { titre: string; texte: string; compteur?: number; lien?: { href: string; label: string } };

const AVANTAGES: Avantage[] = [
  {
    titre: "Livraison partout à Kinshasa",
    texte: `${boutique.livraison.zone}, de Gombe à Masina. Le prix dépend du trajet et vous est confirmé sur WhatsApp.`,
    compteur: boutique.livraison.prixMinFC,
  },
  {
    titre: "Cash à la livraison",
    texte: "Vous payez uniquement quand le colis est entre vos mains. Aucun paiement à l’avance, zéro risque.",
  },
  {
    titre: "Commande sur WhatsApp",
    texte: "Ajoutez vos articles au panier et envoyez-le en un clic : on vous répond rapidement pour tout organiser.",
    lien: { href: "/boutique/", label: "Commencer" },
  },
  {
    titre: "Sélection soignée",
    texte: "Bien-être, beauté, accessoires : chaque article est choisi pour sa qualité et son utilité au quotidien.",
    lien: { href: "/infos/", label: "En savoir plus" },
  },
];

function Etoile() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-[0.35em] inline-block size-[0.55em] shrink-0 fill-current align-middle">
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
    </svg>
  );
}

export function Manifeste() {
  return (
    <section aria-labelledby="titre-manifeste" className="relative -mt-px overflow-hidden bg-noir pb-24 pt-10 text-white sm:pb-32 sm:pt-14">
      {/* Deux bandeaux en sens opposés : ils accélèrent avec le défilement */}
      <div className="font-affiche text-[17vw] uppercase leading-none sm:text-[11vw] lg:text-[8.5vw]">
        <BandeauVitesse vitesseBase={3.5}>
          {MOTS_BANDEAU.map((m) => (
            <span key={m} className="flex items-center whitespace-nowrap pr-[0.35em]">
              {m}
              <Etoile />
            </span>
          ))}
        </BandeauVitesse>
        <BandeauVitesse vitesseBase={3.5} sens={-1} className="-mt-[0.08em]">
          {MOTS_BANDEAU.map((m) => (
            <span key={m} className="texte-contour-blanc flex items-center whitespace-nowrap pr-[0.35em]">
              {m}
              <span className="text-white [-webkit-text-stroke:0]">
                <Etoile />
              </span>
            </span>
          ))}
        </BandeauVitesse>
      </div>

      <Container className="mt-20 sm:mt-28">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.38em] text-white/50">— Pourquoi Jazzy World</p>
        <h2 id="titre-manifeste" className="sr-only">
          Acheter en ligne, en toute confiance
        </h2>
        <TexteRevele
          texte="Vous choisissez. Nous livrons partout à Kinshasa. Vous payez cash, seulement quand le colis est entre vos mains."
          className="mt-6 max-w-5xl text-[2rem] font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl"
          opaciteDepart={0.12}
        />

        <ol className="mt-20 border-t border-white/20 sm:mt-28">
          {AVANTAGES.map((a, i) => (
            <LigneAvantage key={a.titre} avantage={a} index={i} />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function LigneAvantage({ avantage, index }: { avantage: Avantage; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const p = useProgression(ref, ["start end", "start 55%"], false, 1);
  // Chaque ligne arrive plus fort que la précédente.
  const amplitude = 18 + index * 12;
  const sens = index % 2 === 0 ? -1 : 1;
  const x = useTransform(p, [0, 1], [`${sens * amplitude}vw`, "0vw"]);
  const rotation = useTransform(p, [0, 1], [sens * (4 + index * 2), 0]);
  const opacite = useTransform(p, [0, 0.6], [0, 1]);
  const trait = useTransform(p, [0.2, 1], [0, 1]);

  return (
    <li ref={ref} className="relative border-b border-white/20">
      <motion.div
        style={{ x, rotate: rotation, opacity: opacite }}
        className="group relative grid gap-4 py-8 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-8 sm:py-10 lg:grid-cols-[10rem_1.1fr_1fr_auto]"
      >
        <span className="font-affiche text-6xl leading-none text-white/25 transition-colors duration-500 group-hover:text-white sm:text-7xl lg:text-8xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          {avantage.titre}
          {avantage.compteur !== undefined && (
            <span className="mt-2 block text-base font-semibold normal-case tracking-normal text-white/70 sm:text-lg">
              dès <Compteur valeur={avantage.compteur} />
            </span>
          )}
        </h3>
        <p className="max-w-md text-[0.95rem] leading-relaxed text-white/65 sm:col-start-2 lg:col-start-auto">{avantage.texte}</p>
        {avantage.lien ? (
          <Link
            href={avantage.lien.href}
            className="inline-flex items-center gap-2 justify-self-start text-[0.72rem] font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:row-start-1 sm:col-start-3 sm:justify-self-end lg:col-start-4"
          >
            {avantage.lien.label}
            <span className="grid size-10 place-items-center border border-white/40 transition-colors duration-300 group-hover:bg-white group-hover:text-noir">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
      </motion.div>
      <motion.span
        aria-hidden="true"
        style={{ scaleX: trait }}
        className="absolute inset-x-0 -bottom-px block h-px origin-left bg-white"
      />
    </li>
  );
}

const formateurFC = new Intl.NumberFormat("fr-FR");

function Compteur({ valeur }: { valeur: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const reduit = useReducedMotion();
  const monte = useMonte();
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
    <span ref={ref} className="tabular-nums text-white">
      {/* Valeur finale lisible par les lecteurs d’écran, le compteur est décoratif */}
      <span className="sr-only">{formateurFC.format(valeur)} FC</span>
      <span aria-hidden="true">{formateurFC.format(monte && reduit ? valeur : affiche)} FC</span>
    </span>
  );
}
