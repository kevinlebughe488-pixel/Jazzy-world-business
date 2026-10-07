import type { Metadata } from "next";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import {
  Banknote,
  HandCoins,
  MapPin,
  MessageCircleMore,
  PackageCheck,
  Route,
  Truck,
} from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Contact } from "@/components/home/Contact";
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

function Point({ icone: I, children }: { icone: Icone; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-lin text-encre-doux">
        <I className="size-3.5" aria-hidden />
      </span>
      <span className="leading-relaxed text-encre-doux">{children}</span>
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
    <article className="h-full rounded-carte bg-carte p-6 shadow-doux sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-lin text-encre">
          <I className="size-5" aria-hidden />
        </span>
        {accent}
      </div>
      <p className="mt-6 text-sm font-medium text-muet">{surtitre}</p>
      <h2 className="mt-1 font-serif text-4xl leading-[1.05] sm:text-5xl">{titre}</h2>
      <div className="mt-6">{children}</div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

const etapes: { titre: string; texte: string }[] = [
  {
    titre: "Choisissez vos articles",
    texte: "Parcourez la boutique et ajoutez au panier les produits qui vous plaisent.",
  },
  {
    titre: "Envoyez sur WhatsApp",
    texte: "Depuis le panier, touchez « Commander sur WhatsApp » : votre commande part en message prérempli.",
  },
  {
    titre: "On confirme ensemble",
    texte: "Nous vous confirmons le montant exact, le prix de la livraison et le délai.",
  },
  {
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
        La livraison est à partir de <strong className="font-medium text-encre">{prixLivraison}</strong>. Le prix
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
          className="font-medium text-encre underline decoration-trait-fort underline-offset-4 hover:decoration-encre"
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
    <div>
      {/* ---------- En-tête ---------- */}
      <section className="pb-14 pt-12 sm:pb-20 sm:pt-16 lg:pt-20">
        <Container className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p className="entree etiquette">Livraison &amp; infos</p>
            <h1
              className="entree mt-4 font-serif text-6xl leading-[0.98] tracking-[-0.015em] sm:text-7xl lg:text-8xl"
              style={{ "--d": "0.06s" } as CSSProperties}
            >
              Commander, recevoir, <em className="text-encre-doux">payer à la livraison.</em>
            </h1>
            <p
              className="entree mt-6 max-w-xl text-lg leading-relaxed text-encre-doux"
              style={{ "--d": "0.12s" } as CSSProperties}
            >
              Tout ce qu&apos;il faut savoir pour commander chez {boutique.nom} : livraison partout à Kinshasa,
              paiement cash à la réception, et une commande qui se fait en un message WhatsApp.
            </p>
          </div>
          <div className="entree" style={{ "--d": "0.18s" } as CSSProperties}>
            <div className="flex flex-col justify-between gap-12 rounded-carte bg-lin p-7 sm:p-9">
              <p className="text-sm font-medium text-encre-doux">Livraison</p>
              <div>
                <p className="font-serif text-6xl leading-none sm:text-7xl">
                  <span className="text-4xl italic text-encre-doux sm:text-5xl">dès </span>
                  {prixLivraison}
                </p>
                <p className="mt-4 leading-relaxed text-encre-doux">
                  Partout à Kinshasa. Le prix exact dépend du trajet et vous est confirmé sur WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Livraison & paiement ---------- */}
      <section aria-label="Livraison et paiement" className="pb-20 sm:pb-28">
        <Container className="grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <CarteInfo
              icone={Truck}
              surtitre="Livraison"
              titre="Partout à Kinshasa"
              accent={
                <span className="rounded-full bg-ocre-pale px-3.5 py-1.5 text-sm text-ocre-fonce">dès {prixLivraison}</span>
              }
            >
              <ul className="space-y-3.5">
                <Point icone={MapPin}>Nous livrons dans toutes les communes de Kinshasa, directement chez vous.</Point>
                <Point icone={Route}>
                  À partir de <strong className="font-medium text-encre">{prixLivraison}</strong>. Le prix varie
                  selon le trajet et vous est confirmé sur WhatsApp.
                </Point>
                <Point icone={MessageCircleMore}>Le délai de livraison vous est confirmé sur WhatsApp.</Point>
              </ul>
            </CarteInfo>
          </Reveal>
          <Reveal className="h-full" delai={0.08}>
            <CarteInfo
              icone={HandCoins}
              surtitre="Paiement"
              titre="Cash à la livraison"
              accent={
                <span className="rounded-full bg-sauge-pale px-3.5 py-1.5 text-sm text-sauge-fonce">
                  0 paiement en ligne
                </span>
              }
            >
              <ul className="space-y-3.5">
                <Point icone={Banknote}>Vous payez en cash, à la réception de votre commande.</Point>
                <Point icone={PackageCheck}>
                  Vous recevez d&apos;abord, vous payez ensuite : aucun paiement à l&apos;avance.
                </Point>
                <Point icone={MessageCircleMore}>
                  Les prix sont affichés en dollars (USD) ; le montant exact vous est confirmé sur WhatsApp.
                </Point>
              </ul>
            </CarteInfo>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Comment commander ---------- */}
      <section aria-labelledby="titre-commander" className="pb-20 sm:pb-28">
        <Container>
          <div className="rounded-[1.75rem] bg-lin px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
            <Reveal className="max-w-2xl">
              <h2 id="titre-commander" className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl">
                Comment <em>commander</em>&nbsp;?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-encre-doux">
                Pas de compte à créer, pas de carte bancaire. Tout se passe sur WhatsApp.
              </p>
            </Reveal>

            <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {etapes.map(({ titre, texte }, i) => (
                <li key={titre}>
                  <Reveal delai={i * 0.06} className="h-full border-t border-trait-fort pt-5">
                    <span aria-hidden="true" className="font-serif text-5xl leading-none text-ocre-fonce">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-medium">
                      <span className="sr-only">Étape {i + 1} : </span>
                      {titre}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-encre-doux">{texte}</p>
                  </Reveal>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/boutique/" fleche>
                Voir la boutique
              </ButtonLink>
              <ButtonLink href="/panier/" variante="secondaire">
                Voir mon panier
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section aria-labelledby="titre-faq" className="pb-20 sm:pb-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="titre-faq" className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl">
              Vos questions, <em>nos réponses</em>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-encre-doux">
              Vous ne trouvez pas votre réponse ? Écrivez-nous, on vous répond sur WhatsApp.
            </p>
            <ButtonLink href={lienQuestion} externe variante="whatsapp" className="mt-7 w-full sm:w-auto">
              <WhatsAppIcon className="size-5" /> Écrire sur WhatsApp
            </ButtonLink>
          </Reveal>
          <Faq questions={questions} />
        </Container>
      </section>

      {/* ---------- Contact ---------- */}
      <Contact />
    </div>
  );
}
