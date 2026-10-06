import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { SaufAccueil } from "./SaufAccueil";
import { GrandLogo } from "./GrandLogo";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/boutique/", label: "Boutique" },
  { href: "/infos/", label: "Livraison & infos" },
  { href: "/panier/", label: "Panier" },
];

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-noir";

const titreColonne = "text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white/45";

export function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-noir text-white" aria-labelledby="titre-pied">
      <h2 id="titre-pied" className="sr-only">
        Pied de page
      </h2>

      <Container className="pt-16 sm:pt-20">
        {/* Bandeau d'appel à l'action */}
        <SaufAccueil>
          <Reveal className="mb-14 lg:mb-20">
            <div className="flex flex-col gap-6 border border-white/20 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className={titreColonne}>Besoin d&apos;aide ?</p>
                <p className="mt-3 font-affiche text-3xl uppercase leading-[1.05] tracking-wide sm:text-4xl">
                  Une question sur un produit&nbsp;? On vous répond sur WhatsApp.
                </p>
              </div>
              <a
                href={lienWhatsApp(messageQuestion())}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-whatsapp px-7 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-noir transition-colors duration-300 hover:bg-whatsapp-fonce ${focus}`}
              >
                <WhatsAppIcon className="size-5" />
                Écrire sur WhatsApp
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </Reveal>
        </SaufAccueil>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Marque */}
          <Reveal className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className={`inline-flex ${focus}`} aria-label={`${boutique.nom} — accueil`}>
              <Logo surFondNoir />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed text-white/70">{boutique.slogan}.</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
              Commandez en quelques clics, confirmez sur WhatsApp et payez seulement à la réception.
            </p>
          </Reveal>

          {/* Navigation */}
          <Reveal delai={0.08} className="lg:col-span-2">
            <nav aria-label="Liens du pied de page">
              <h3 className={titreColonne}>Navigation</h3>
              <ul className="mt-5 space-y-1">
                {liens.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`group -mx-2 inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors hover:text-white ${focus}`}
                    >
                      <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-5" aria-hidden="true" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Livraison & paiement */}
          <Reveal delai={0.16} className="lg:col-span-3">
            <h3 className={titreColonne}>Livraison & paiement</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em]">{boutique.livraison.zone}</dt>
                <dd className="mt-1 text-white/55">Kinshasa, RD Congo</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em]">
                  À partir de {formatFC(boutique.livraison.prixMinFC)}
                </dt>
                <dd className="mt-1 text-white/55">{boutique.livraison.note}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em]">{boutique.paiement}</dt>
                <dd className="mt-1 text-white/55">Prix affichés en dollars (USD)</dd>
              </div>
            </dl>
          </Reveal>

          {/* Contact */}
          <Reveal delai={0.24} className="lg:col-span-3">
            <h3 className={titreColonne}>Contact</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={lienWhatsApp(messageQuestion())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex min-h-14 items-center gap-3 border border-white/15 p-3 transition-colors duration-300 hover:border-whatsapp hover:bg-whatsapp/15 ${focus}`}
                >
                  <span className="grid size-10 shrink-0 place-items-center bg-whatsapp text-noir transition-transform duration-300 group-hover:scale-110">
                    <WhatsAppIcon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-60">WhatsApp</span>
                    <span className="block font-semibold tabular-nums">{boutique.whatsappAffiche}</span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto size-4 opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <a
                  href={boutique.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex min-h-14 items-center gap-3 border border-white/15 p-3 transition-colors duration-300 hover:border-facebook hover:bg-facebook/15 ${focus}`}
                >
                  <span className="grid size-10 shrink-0 place-items-center bg-facebook text-white transition-transform duration-300 group-hover:scale-110">
                    <FacebookIcon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-60">Facebook</span>
                    <span className="block font-semibold">{boutique.nom}</span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto size-4 opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs uppercase tracking-[0.16em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {annee} {boutique.nom}. Tous droits réservés.
          </p>
          <p>Fait avec soin à Kinshasa 🇨🇩</p>
        </div>
      </Container>

      {/* Logo géant (révélé lettre par lettre en arrivant en bas) */}
      <GrandLogo className="px-2 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-10 sm:px-4 sm:pb-[calc(1rem+env(safe-area-inset-bottom))]" />
    </footer>
  );
}
