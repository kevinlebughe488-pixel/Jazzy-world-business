import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  Banknote,
  HandCoins,
  MapPin,
  MessageCircleMore,
  MousePointerClick,
  PackageCheck,
  Route,
  Send,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { Faq, type QuestionFaq } from "./Faq";

const prixLivraison = formatFC(boutique.livraison.prixMinFC);

export const metadata: Metadata = {
  title: "Livraison & infos",
  description: `Livraison partout à Kinshasa à partir de ${prixLivraison}, paiement cash à la livraison, commande simple sur WhatsApp. Toutes les réponses à vos questions.`,
  alternates: { canonical: "/infos/" },
  openGraph: {
    title: `Livraison & infos | ${boutique.nom}`,
    description: `Livraison partout à Kinshasa à partir de ${prixLivraison}. Paiement cash à la livraison.`,
    type: "website",
    locale: "fr_CD",
  },
};

type Icone = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const lienQuestion = lienWhatsApp(messageQuestion());

/* ------------------------------------------------------------------ */

function Etiquette({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.38em] text-gris-500">
      {children}
    </span>
  );
}

function Point({ icone: I, children }: { icone: Icone; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center bg-noir text-white">
        <I className="size-4" aria-hidden />
      </span>
      <span className="leading-relaxed text-noir/80">{children}</span>
    </li>
  );
}

function CarteInfo({
  icone: I,
  surtitre,
  titre,
  children,
  accent,
}: {
  icone: Icone;
  surtitre: string;
  titre: ReactNode;
  children: ReactNode;
  accent?: ReactNode;
}) {
  return (
    <article className="group relative h-full overflow-hidden bg-white p-6 ring-1 ring-gris-200 transition-transform duration-500 ease-[var(--ease-doux)] hover:-translate-y-1 sm:p-8">
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="bg-noir grid size-14 place-items-center text-white transition-transform duration-500 ease-[var(--ease-doux)] group-hover:-rotate-6 group-hover:scale-105">
            <I className="size-7" aria-hidden />
          </span>
          {accent}
        </div>
        <p className="mt-6 text-[0.66rem] font-bold uppercase tracking-[0.32em] text-gris-500">{surtitre}</p>
        <h2 className="mt-2 font-affiche text-4xl uppercase leading-[0.95] text-noir sm:text-5xl">{titre}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

const etapes: { icone: Icone; titre: string; texte: string }[] = [
  {
    icone: MousePointerClick,
    titre: "Choisissez vos articles",
    texte: "Parcourez la boutique et ajoutez au panier les produits qui vous plaisent.",
  },
  {
    icone: Send,
    titre: "Envoyez sur WhatsApp",
    texte: "Depuis le panier, touchez « Commander sur WhatsApp » : votre commande part en message prérempli.",
  },
  {
    icone: MessageCircleMore,
    titre: "On confirme ensemble",
    texte: "Nous vous confirmons le montant exact, le prix de la livraison et le délai.",
  },
  {
    icone: PackageCheck,
    titre: "Recevez et payez",
    texte: "Vous êtes livré(e) chez vous et vous payez en cash à la réception.",
  },
];

const questions: QuestionFaq[] = [
  {
    question: "Comment passer une commande ?",
    reponse: (
      <p>
        Ajoutez vos articles au panier, puis touchez « Commander sur WhatsApp ». Un message avec votre commande
        s&apos;ouvre déjà rempli : il suffit de l&apos;envoyer. Nous vous répondons sur WhatsApp pour tout confirmer.
      </p>
    ),
  },
  {
    question: "Comment se passe le paiement ?",
    reponse: (
      <p>
        Le paiement se fait en cash à la livraison : vous payez au moment où vous recevez votre commande. Rien à
        payer en ligne.
      </p>
    ),
  },
  {
    question: "Combien coûte la livraison ?",
    reponse: (
      <p>
        La livraison est à partir de <strong className="font-semibold text-noir">{prixLivraison}</strong>. Le prix
        varie selon le trajet jusqu&apos;à chez vous et vous est confirmé sur WhatsApp avant la livraison.
      </p>
    ),
  },
  {
    question: "Livrez-vous dans ma commune ?",
    reponse: (
      <p>
        Nous livrons partout à Kinshasa. Indiquez simplement votre commune et votre adresse dans votre message
        WhatsApp.
      </p>
    ),
  },
  {
    question: "Quel est le délai de livraison ?",
    reponse: <p>Le délai vous est confirmé sur WhatsApp au moment de la commande.</p>,
  },
  {
    question: "Puis-je poser des questions avant de commander ?",
    reponse: (
      <p>
        Bien sûr. Écrivez-nous sur WhatsApp au{" "}
        <a
          href={lienQuestion}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-noir underline decoration-noir/30 underline-offset-4 hover:decoration-noir"
        >
          {boutique.whatsappAffiche}
        </a>{" "}
        pour toute question sur un produit, sa disponibilité ou la livraison.
      </p>
    ),
  },
  {
    question: "Comment modifier ma commande ?",
    reponse: (
      <p>
        Écrivez-nous simplement sur WhatsApp, dans la même conversation, en précisant ce que vous souhaitez changer.
      </p>
    ),
  },
  {
    question: "Les prix sont en dollars : comment ça marche ?",
    reponse: (
      <p>
        Les prix sont affichés en dollars américains (USD). Le montant exact à payer vous est confirmé sur
        WhatsApp avec votre commande.
      </p>
    ),
  },
];

/* ------------------------------------------------------------------ */

export default function Infos() {
  return (
    <div className="relative overflow-x-clip">
      {/* ---------- En-tête ---------- */}
      <section className="relative pb-14 pt-24 sm:pb-20 lg:pt-32">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <Etiquette>
                <Truck className="size-4" aria-hidden /> Livraison &amp; infos
              </Etiquette>
            </Reveal>
            <Reveal delai={0.08}>
              <h1 className="mt-4 font-affiche text-6xl uppercase leading-[0.9] tracking-[0.01em] text-noir sm:text-7xl lg:text-8xl">
                Commander, recevoir,{" "}
                <span className="texte-contour [-webkit-text-stroke-width:2px]">payer à la livraison.</span>
              </h1>
            </Reveal>
            <Reveal delai={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gris-700">
                Tout ce qu&apos;il faut savoir pour commander chez {boutique.nom} : livraison partout à Kinshasa,
                paiement cash à la réception, et une commande qui se fait en un message WhatsApp.
              </p>
            </Reveal>
            <Reveal delai={0.24}>
              <ul className="mt-8 flex flex-wrap gap-3">
                {[
                  { I: MapPin, t: "Partout à Kinshasa" },
                  { I: Truck, t: `Dès ${prixLivraison}` },
                  { I: Banknote, t: "Cash à la livraison" },
                ].map(({ I, t }) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-noir ring-1 ring-inset ring-noir"
                  >
                    <I className="size-4 text-noir" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delai={0.2} className="relative w-full">
            <div className="flex aspect-[5/4] flex-col justify-between bg-noir p-7 text-white sm:p-10">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.38em] text-white/60">Livraison dès</p>
              <p className="font-affiche text-[16vw] leading-[0.85] sm:text-8xl lg:text-[7rem]">{prixLivraison}</p>
              <p className="text-sm leading-relaxed text-white/70">
                Partout à Kinshasa. Le prix exact dépend du trajet et vous est confirmé sur WhatsApp.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Livraison & paiement ---------- */}
      <section aria-label="Livraison et paiement" className="pb-20 sm:pb-28">
        <Container className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <CarteInfo
              icone={Truck}
              surtitre="Livraison"
              titre="Partout à Kinshasa"
              accent={
                <span className="bg-noir px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white">
                  dès {prixLivraison}
                </span>
              }
            >
              <ul className="space-y-3.5">
                <Point icone={MapPin}>Nous livrons dans toutes les communes de Kinshasa, directement chez vous.</Point>
                <Point icone={Route}>
                  À partir de <strong className="font-semibold text-noir">{prixLivraison}</strong>. Le prix varie
                  selon le trajet et vous est confirmé sur WhatsApp.
                </Point>
                <Point icone={MessageCircleMore}>Le délai de livraison vous est confirmé sur WhatsApp.</Point>
              </ul>
            </CarteInfo>
          </Reveal>
          <Reveal className="h-full" delai={0.1}>
            <CarteInfo
              icone={HandCoins}
              surtitre="Paiement"
              titre="Cash à la livraison"
              accent={
                <span className="px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-noir ring-1 ring-inset ring-noir">
                  0 paiement en ligne
                </span>
              }
            >
              <ul className="space-y-3.5">
                <Point icone={Banknote}>Vous payez en cash, à la réception de votre commande.</Point>
                <Point icone={PackageCheck}>Vous recevez d&apos;abord, vous payez ensuite : aucun paiement à l&apos;avance.</Point>
                <Point icone={MessageCircleMore}>
                  Les prix sont affichés en dollars (USD) ; le montant exact vous est confirmé sur WhatsApp.
                </Point>
              </ul>
            </CarteInfo>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Comment commander ---------- */}
      <section aria-labelledby="titre-commander" className="relative overflow-hidden bg-noir py-20 text-white sm:py-28">
        <Container className="relative">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.38em] text-white/50">
              <ShoppingBag className="size-4" aria-hidden /> En 4 étapes
            </span>
            <h2 id="titre-commander" className="mt-4 font-affiche text-6xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
              Comment commander ?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Pas de compte à créer, pas de carte bancaire. Tout se passe sur WhatsApp.
            </p>
          </Reveal>

          <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map(({ icone: I, titre, texte }, i) => (
              <li key={titre} className="h-full">
                <Reveal delai={i * 0.1} className="h-full">
                  <div className="group relative h-full bg-white/[0.06] p-6 ring-1 ring-white/10 transition-colors duration-500 hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center bg-white text-noir transition-transform duration-500 ease-[var(--ease-doux)] group-hover:scale-110">
                        <I className="size-6" aria-hidden />
                      </span>
                      <span aria-hidden="true" className="texte-contour-blanc font-affiche text-6xl leading-none opacity-60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 text-base font-bold uppercase tracking-[0.06em]">
                      <span className="sr-only">Étape {i + 1} : </span>
                      {titre}
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/70">{texte}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delai={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/boutique/" variante="inverse" className="w-full sm:w-auto">
              Voir la boutique <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/panier/" variante="secondaire" className="w-full bg-transparent text-white ring-white hover:bg-white hover:text-noir sm:w-auto">
              <ShoppingBag className="size-4" aria-hidden /> Voir mon panier
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section aria-labelledby="titre-faq" className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <Etiquette>Questions fréquentes</Etiquette>
            <h2 id="titre-faq" className="mt-4 font-affiche text-6xl uppercase leading-[0.9] text-noir sm:text-7xl">
              Vos questions, <span className="texte-contour [-webkit-text-stroke-width:2px]">nos réponses</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-noir/70">
              Vous ne trouvez pas votre réponse ? Écrivez-nous, on vous répond sur WhatsApp.
            </p>
            <ButtonLink href={lienQuestion} externe variante="whatsapp" className="mt-6 w-full sm:w-auto">
              <WhatsAppIcon className="size-5" /> Poser une question
            </ButtonLink>
          </Reveal>
          <Faq questions={questions} />
        </Container>
      </section>

      {/* ---------- Contact ---------- */}
      <section aria-labelledby="titre-contact" className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <div className="bg-noir relative overflow-hidden p-8 text-white sm:p-12 lg:p-16">
              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div>
                  <h2 id="titre-contact" className="font-affiche text-6xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
                    Une question ? Parlons-en.
                  </h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/85">
                    Commandes, disponibilité, livraison : contactez-nous directement, nous sommes à Kinshasa.
                  </p>
                </div>
                <div className="grid gap-4">
                  <a
                    href={lienQuestion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-20 items-center gap-4 bg-white p-4 text-noir transition-transform duration-300 ease-[var(--ease-doux)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center bg-noir text-white">
                      <WhatsAppIcon className="size-6" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-noir/50">WhatsApp</span>
                      <span className="block whitespace-nowrap text-lg font-bold">{boutique.whatsappAffiche}</span>
                    </span>
                    <ArrowRight
                      className="size-5 text-noir/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-noir"
                      aria-hidden
                    />
                  </a>
                  <a
                    href={boutique.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-20 items-center gap-4 bg-white/10 p-4 text-white ring-1 ring-white/25 transition-[transform,background-color] duration-300 ease-[var(--ease-doux)] hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center bg-white text-noir">
                      <FacebookIcon className="size-6" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60">Facebook</span>
                      <span className="block text-lg font-bold">Suivez-nous sur Facebook</span>
                    </span>
                    <ArrowRight
                      className="size-5 text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                      aria-hidden
                    />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          <p className="mt-8 text-center text-sm text-noir/60">
            Envie de découvrir nos produits ?{" "}
            <Link href="/boutique/" className="font-semibold text-noir underline decoration-noir/30 underline-offset-4 hover:decoration-noir">
              Parcourir la boutique
            </Link>
          </p>
        </Container>
      </section>
    </div>
  );
}
