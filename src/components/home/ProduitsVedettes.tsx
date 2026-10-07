import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { produits, produitsVedettes } from "@/lib/catalogue";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/product/ProductCard";

/** Produit mis en grand dans la mosaïque s'il fait partie de la sélection (sinon : le premier). */
const PRODUIT_A_LA_UNE = "sac-de-voyage";

/**
 * Sélection du moment en mosaïque : un grand produit, trois plus petits et une case
 * vers la boutique (exactement 5 cases, pas de case vide).
 */
export function ProduitsVedettes() {
  const autres = produits.filter((p) => !p.vedette && p.enStock);
  const selection = [...produitsVedettes, ...autres].slice(0, 4);
  const une = selection.find((p) => p.id === PRODUIT_A_LA_UNE) ?? selection[0];
  const reste = selection.filter((p) => p !== une);
  if (!une) return null;

  return (
    <section id="produits-phares" aria-labelledby="titre-produits-phares" className="py-20 sm:py-28">
      <Container>
        <Reveal className="mb-9 max-w-2xl sm:mb-12">
          <h2 id="titre-produits-phares" className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl">
            Nos produits <em>phares</em>
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-encre-doux">
            Notre sélection du moment, à commander en un message.
          </p>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
          <li className="col-span-2 lg:row-span-2">
            <Reveal className="h-full">
              <ProductCard produit={une} grand prioritaire />
            </Reveal>
          </li>
          {reste.map((produit, i) => (
            <li key={produit.id} className="min-w-0">
              <Reveal delai={0.06 * (i + 1)} className="h-full">
                <ProductCard produit={produit} />
              </Reveal>
            </li>
          ))}
          <li className="min-w-0">
            <Reveal delai={0.24} className="h-full">
              <Link
                href="/boutique/"
                className="group flex h-full min-h-56 flex-col justify-between rounded-carte bg-lin p-5 transition-colors duration-300 hover:bg-trait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre sm:p-6"
              >
                <span className="font-serif text-[1.75rem] leading-[1.08] sm:text-3xl">
                  {produits.length} produits, <em className="text-encre-doux">choisis avec soin.</em>
                </span>
                <span className="inline-flex items-center gap-3 text-[0.95rem] font-medium">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-encre text-papier transition-transform duration-300 ease-[var(--ease-doux)] group-hover:translate-x-1">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                  Voir la boutique
                </span>
              </Link>
            </Reveal>
          </li>
        </ul>
      </Container>
    </section>
  );
}
