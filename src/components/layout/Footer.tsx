import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { SaufAccueil } from "./SaufAccueil";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/boutique/", label: "Boutique" },
  { href: "/infos/", label: "Livraison & infos" },
  { href: "/panier/", label: "Panier" },
];

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre";

const titreColonne = "text-sm font-semibold text-encre";

export function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="relative border-t border-trait bg-lin" aria-labelledby="titre-pied">
      <h2 id="titre-pied" className="sr-only">
        Pied de page
      </h2>

      <Container className="pb-[calc(6rem+env(safe-area-inset-bottom))] pt-14 sm:pb-10 sm:pt-20">
        {/* Bandeau d'appel (pages sans section contact) */}
        <SaufAccueil>
          <div className="mb-14 flex flex-col gap-6 rounded-carte bg-carte p-6 shadow-doux sm:p-9 md:flex-row md:items-center md:justify-between lg:mb-20">
            <p className="max-w-xl font-serif text-3xl leading-[1.1] sm:text-4xl">
              Une question sur un produit&nbsp;? <em className="text-encre-doux">On vous répond sur WhatsApp.</em>
            </p>
            <ButtonLink href={lienWhatsApp(messageQuestion())} externe variante="whatsapp" className="shrink-0">
              <WhatsAppIcon className="size-5" />
              Écrire sur WhatsApp
            </ButtonLink>
          </div>
        </SaufAccueil>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Marque */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className={`inline-flex rounded-md ${focus}`} aria-label={`${boutique.nom}, accueil`}>
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm font-serif text-2xl leading-snug text-encre">{boutique.slogan}.</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Liens du pied de page" className="lg:col-span-2">
            <h3 className={titreColonne}>Navigation</h3>
            <ul className="mt-4 space-y-1">
              {liens.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`-mx-1 inline-flex min-h-10 items-center rounded-md px-1 text-[0.95rem] text-encre-doux transition-colors hover:text-encre ${focus}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Livraison & paiement */}
          <div className="lg:col-span-3">
            <h3 className={titreColonne}>Livraison &amp; paiement</h3>
            <dl className="mt-4 space-y-4 text-[0.95rem]">
              <div>
                <dt className="text-encre">{boutique.livraison.zone}</dt>
                <dd className="mt-0.5 text-muet">À partir de {formatFC(boutique.livraison.prixMinFC)}, selon le trajet.</dd>
              </div>
              <div>
                <dt className="text-encre">{boutique.paiement}</dt>
                <dd className="mt-0.5 text-muet">Prix affichés en dollars (USD).</dd>
              </div>
            </dl>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className={titreColonne}>Contact</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={lienWhatsApp(messageQuestion())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 rounded-full bg-carte p-1.5 pr-4 ring-1 ring-inset ring-trait transition-shadow duration-300 hover:ring-encre/30 ${focus}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-whatsapp text-encre ring-1 ring-inset ring-trait-fort">
                    <WhatsAppIcon className="size-[1.1rem]" />
                  </span>
                  <span className="text-[0.95rem] tabular-nums">{boutique.whatsappAffiche}</span>
                  <ArrowUpRight
                    className="ml-auto size-4 text-muet transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <a
                  href={boutique.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 rounded-full bg-carte p-1.5 pr-4 ring-1 ring-inset ring-trait transition-shadow duration-300 hover:ring-encre/30 ${focus}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-facebook text-white">
                    <FacebookIcon className="size-[1.1rem]" />
                  </span>
                  <span className="text-[0.95rem]">Facebook</span>
                  <ArrowUpRight
                    className="ml-auto size-4 text-muet transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-trait-fort/70 pt-6 text-sm text-muet sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {annee} {boutique.nom}. Tous droits réservés.
          </p>
          <p>Fait avec soin à Kinshasa.</p>
        </div>
      </Container>
    </footer>
  );
}
