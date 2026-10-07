import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

const raccourcis = [
  { href: "/", label: "Accueil", detail: "Revenir à la page d’accueil" },
  { href: "/boutique/", label: "Boutique", detail: "Voir tous nos produits" },
  { href: "/infos/", label: "Livraison & infos", detail: "Livraison, paiement, contact" },
];

const delai = (d: string) => ({ "--d": d }) as CSSProperties;

export function PageIntrouvable() {
  return (
    <section className="pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-20">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="entree font-serif text-[9rem] italic leading-none text-ocre sm:text-[12rem]" aria-hidden="true">
            404
          </p>
          <h1
            className="entree mt-2 font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl"
            style={delai("0.06s")}
          >
            Cette page a fait <em>le tour du monde</em>
          </h1>
          <p className="entree mt-5 max-w-xl text-lg leading-relaxed text-encre-doux" style={delai("0.12s")}>
            La page que vous cherchez n’existe pas ou a été déplacée. Nos produits, eux, sont toujours livrés partout à
            Kinshasa.
          </p>

          <div className="entree mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={delai("0.18s")}>
            <ButtonLink href="/boutique/" fleche>
              Voir la boutique
            </ButtonLink>
            <ButtonLink href={lienWhatsApp(messageQuestion())} externe variante="whatsapp">
              <WhatsAppIcon className="size-5" />
              Écrire sur WhatsApp
            </ButtonLink>
          </div>

          {/* Raccourcis */}
          <ul className="entree mt-14 w-full divide-y divide-trait-fort border-y border-trait-fort text-left" style={delai("0.24s")}>
            {raccourcis.map(({ href, label, detail }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-4 rounded-md py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-2xl leading-tight">{label}</span>
                    <span className="block text-sm text-muet">{detail}</span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lin transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
