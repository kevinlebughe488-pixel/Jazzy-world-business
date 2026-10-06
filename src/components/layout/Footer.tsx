import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Banknote, MapPin, Truck } from "lucide-react";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { SaufAccueil } from "./SaufAccueil";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/boutique/", label: "Boutique" },
  { href: "/infos/", label: "Livraison & infos" },
  { href: "/panier/", label: "Panier" },
];

const focus =
  "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ciel focus-visible:ring-offset-2 focus-visible:ring-offset-nuit-900";

export function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-nuit-900 text-white" aria-labelledby="titre-pied">
      <h2 id="titre-pied" className="sr-only">
        Pied de page
      </h2>

      {/* Décor : halos + globe en filigrane */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-bleu/30 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-ciel/15 blur-3xl" />
        <Image
          src="/brand/globe.webp"
          alt=""
          width={600}
          height={600}
          className="absolute -right-24 top-10 w-[22rem] max-w-none opacity-[0.08] sm:-right-16 sm:w-[30rem] lg:-top-10 lg:right-[-4rem] lg:w-[38rem]"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      <Container className="pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(2rem+env(safe-area-inset-bottom))] pt-16 sm:pt-20">
        {/* Bandeau d'appel à l'action */}
        <SaufAccueil>
        <Reveal className="mb-14 lg:mb-20">
          <div className="degrade-marque relative overflow-hidden rounded-[var(--radius-carte)] p-6 shadow-2xl shadow-bleu/20 sm:p-10">
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ciel-200">Besoin d&apos;aide ?</p>
                <p className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
                  Une question sur un produit&nbsp;? On vous répond sur WhatsApp.
                </p>
              </div>
              <a
                href={lienWhatsApp(messageQuestion())}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-white px-7 font-semibold text-nuit shadow-lg transition-transform duration-300 hover:scale-[1.03] active:scale-95 ${focus}`}
              >
                <WhatsAppIcon className="h-6 w-6 text-whatsapp" />
                Écrire sur WhatsApp
                <ArrowUpRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </Reveal>
        </SaufAccueil>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Marque */}
          <Reveal className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className={`inline-flex items-center gap-3 ${focus}`} aria-label={`${boutique.nom} — accueil`}>
              <Image src="/brand/globe.webp" alt="" width={56} height={56} className="h-14 w-14 drop-shadow-[0_0_18px_rgba(79,195,232,0.35)]" />
              <span className="font-display text-xl font-bold leading-tight">
                Jazzy World
                <span className="block text-sm font-medium tracking-[0.25em] text-ciel">BUSINESS</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-white/70">{boutique.slogan}.</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
              Commandez en quelques clics, confirmez sur WhatsApp et payez seulement à la réception.
            </p>
          </Reveal>

          {/* Navigation */}
          <Reveal delai={0.08} className="lg:col-span-2">
            <nav aria-label="Liens du pied de page">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Navigation</h3>
              <ul className="mt-5 space-y-1">
                {liens.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`group -mx-2 inline-flex min-h-11 items-center gap-2 px-2 text-white/80 transition-colors hover:text-white ${focus}`}
                    >
                      <span className="h-px w-0 bg-ciel transition-all duration-300 group-hover:w-4" aria-hidden="true" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Livraison & paiement */}
          <Reveal delai={0.16} className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Livraison & paiement</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <MapPin className="h-5 w-5 text-ciel" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{boutique.livraison.zone}</span>
                  <span className="text-sm text-white/60">Kinshasa, RD Congo</span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Truck className="h-5 w-5 text-ciel" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">À partir de {formatFC(boutique.livraison.prixMinFC)}</span>
                  <span className="text-sm text-white/60">{boutique.livraison.note}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Banknote className="h-5 w-5 text-ciel" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{boutique.paiement}</span>
                  <span className="text-sm text-white/60">Prix affichés en dollars (USD)</span>
                </span>
              </li>
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal delai={0.24} className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Contact</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={lienWhatsApp(messageQuestion())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex min-h-14 items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors duration-300 hover:bg-whatsapp/15 hover:ring-whatsapp/40 ${focus}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-whatsapp text-white transition-transform duration-300 group-hover:scale-110">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-white/60">WhatsApp</span>
                    <span className="block font-semibold tabular-nums">{boutique.whatsappAffiche}</span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <a
                  href={boutique.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex min-h-14 items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors duration-300 hover:bg-[#1877f2]/15 hover:ring-[#1877f2]/40 ${focus}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1877f2] text-white transition-transform duration-300 group-hover:scale-110">
                    <FacebookIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-white/60">Facebook</span>
                    <span className="block font-semibold">{boutique.nom}</span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {annee} {boutique.nom}. Tous droits réservés.
          </p>
          <p>Fait avec soin à Kinshasa 🇨🇩</p>
        </div>
      </Container>
    </footer>
  );
}
