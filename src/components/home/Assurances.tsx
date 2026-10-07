import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";

const libelle = "text-sm font-medium";

/** Les trois promesses de la boutique, en petite mosaïque : livraison, paiement, commande. */
export function Assurances() {
  return (
    <section aria-label="Livraison, paiement et commande" className="pb-6">
      <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-5">
        <Reveal className="sm:col-span-2 lg:col-span-1">
          <article className="flex h-full flex-col justify-between gap-10 rounded-carte bg-lin p-7 sm:p-9">
            <p className={`${libelle} text-encre-doux`}>Livraison</p>
            <div>
              <p className="font-serif text-[3.25rem] leading-none tracking-[-0.01em] sm:text-7xl">
                <span className="text-[2.25rem] italic text-encre-doux sm:text-5xl">dès </span>
                {formatFC(boutique.livraison.prixMinFC)}
              </p>
              <p className="mt-4 max-w-sm leading-relaxed text-encre-doux">
                {boutique.livraison.zone}, de Gombe à Masina. Le prix exact dépend du trajet et vous est confirmé sur
                WhatsApp.
              </p>
            </div>
          </article>
        </Reveal>

        <Reveal delai={0.08}>
          <article className="relative flex h-full flex-col justify-between gap-10 rounded-carte bg-carte p-7 shadow-doux sm:p-8">
            <span aria-hidden="true" className="ruban -top-2.5 right-8 rotate-6 bg-sauge/75" />
            <p className={`${libelle} text-encre-doux`}>Paiement</p>
            <div>
              <p className="font-serif text-4xl leading-[1.05]">
                Cash, <em>à la livraison.</em>
              </p>
              <p className="mt-3 leading-relaxed text-encre-doux">
                Vous payez seulement quand le colis est entre vos mains. Rien à régler en ligne.
              </p>
            </div>
          </article>
        </Reveal>

        <Reveal delai={0.16}>
          <article className="flex h-full flex-col justify-between gap-10 rounded-carte bg-encre p-7 text-papier sm:p-8">
            <p className={`${libelle} text-papier/70`}>Commande</p>
            <div>
              <p className="font-serif text-4xl leading-[1.05]">
                Un message <em className="text-ocre">WhatsApp</em> suffit.
              </p>
              <p className="mt-3 leading-relaxed text-papier/70">
                Votre panier s&apos;écrit tout seul dans le message : il ne reste qu&apos;à l&apos;envoyer.
              </p>
              <Link
                href="#comment-commander"
                className="group mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-papier/10 px-4 text-sm font-medium text-papier ring-1 ring-inset ring-papier/20 transition-colors hover:bg-papier/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-papier"
              >
                Comment ça marche
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
