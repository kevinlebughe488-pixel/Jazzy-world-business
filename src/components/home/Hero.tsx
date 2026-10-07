import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Polaroid } from "@/components/ui/Polaroid";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { boutique, getProduit } from "@/lib/catalogue";
import { formatUSD } from "@/lib/format";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

const delai = (d: string) => ({ "--d": d }) as CSSProperties;

/* Deux tirages photo posés à droite du titre, comme sur une table de travail. */
const TIRAGES = [
  {
    id: "montre-arabe",
    position: "right-[2%] top-0 w-[56%] sm:w-[52%]",
    rotation: 3,
    ruban: "sauge",
    delai: "0.25s",
  },
  {
    id: "lunettes-chromees",
    position: "left-0 top-[22%] w-[46%] sm:w-[44%]",
    rotation: -4,
    ruban: "ocre",
    delai: "0.38s",
  },
] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-titre" className="relative">
      <Container className="grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.08fr_1fr] lg:gap-8 lg:py-12">
        {/* ---------- Texte ---------- */}
        <div className="max-w-xl">
          <p className="entree etiquette">Boutique en ligne · Kinshasa</p>
          <h1
            id="hero-titre"
            className="entree mt-5 font-serif text-[3.4rem] leading-[0.98] tracking-[-0.015em] sm:text-7xl lg:text-[5.6rem]"
            style={delai("0.08s")}
          >
            Le style, <em className="text-encre-doux">livré</em> chez vous.
          </h1>
          <p className="entree mt-6 max-w-md text-lg leading-relaxed text-encre-doux" style={delai("0.16s")}>
            Montres, lunettes, soins et bien-être choisis avec soin. Livraison partout à Kinshasa, paiement cash à la
            réception.
          </p>
          <div className="entree mt-9 flex flex-col gap-3 sm:flex-row" style={delai("0.24s")}>
            <ButtonLink href="/boutique/" fleche>
              Voir la boutique
            </ButtonLink>
            <ButtonLink href={lienWhatsApp(messageQuestion())} externe variante="whatsapp">
              <WhatsAppIcon className="size-[1.1rem]" />
              Écrire sur WhatsApp
            </ButtonLink>
          </div>
        </div>

        {/* ---------- Tirages photo ---------- */}
        <div className="relative mx-auto aspect-[1/1.15] w-full max-w-[34rem] sm:aspect-[1/1.02] lg:max-w-none">
          {TIRAGES.map((t, i) => {
            const produit = getProduit(t.id);
            if (!produit?.images[0]) return null;
            return (
              <div key={t.id} className={`entree absolute ${t.position}`} style={delai(t.delai)}>
                <Link
                  href={`/produits/${produit.id}/`}
                  aria-label={`${produit.nom}, ${formatUSD(produit.prix)}`}
                  className="block rounded-md transition-transform duration-500 ease-[var(--ease-doux)] hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre"
                >
                  <Polaroid
                    src={produit.images[0]}
                    alt=""
                    legende={`${produit.nom.toLowerCase()}, ${formatUSD(produit.prix)}`}
                    rotation={t.rotation}
                    ruban={t.ruban}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 34vw, 52vw"
                  />
                </Link>
              </div>
            );
          })}

          {/* Note manuscrite */}
          <p
            className="entree absolute bottom-[2%] right-[7%] w-[38%] max-w-44 rotate-[2deg] rounded-[3px] bg-ocre-pale px-4 pb-4 pt-5 font-plume text-[1.4rem] leading-[1.1] text-encre shadow-doux sm:text-[1.65rem]"
            style={delai("0.5s")}
          >
            Vous payez à la livraison.
            <span className="mt-1 block text-[1.1rem] text-encre-doux sm:text-xl">{boutique.livraison.zone}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
