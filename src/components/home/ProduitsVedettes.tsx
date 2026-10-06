import { ArrowRight, Sparkles } from "lucide-react";
import { produits, produitsVedettes } from "@/lib/catalogue";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";

export function ProduitsVedettes() {
  const selection = produitsVedettes.length > 0 ? produitsVedettes : produits.slice(0, 4);

  return (
    <section id="produits-phares" aria-labelledby="titre-produits-phares" className="relative isolate py-20 sm:py-28">
      {/* Halo décoratif */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute right-[8%] top-40 h-56 w-56 rounded-full bg-ciel-200/50 blur-3xl" />
      </div>

      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-violet shadow-sm ring-1 ring-violet/15">
                <Sparkles className="size-3.5" aria-hidden />
                Sélection du moment
              </p>
            </Reveal>
            <Reveal delai={0.08}>
              <h2
                id="titre-produits-phares"
                className="mt-4 text-4xl font-bold leading-[1.05] text-nuit sm:text-5xl lg:text-6xl"
              >
                Nos produits <span className="texte-degrade">phares</span>
              </h2>
            </Reveal>
            <Reveal delai={0.16}>
              <p className="mt-4 text-base leading-relaxed text-nuit/70 sm:text-lg">
                Les favoris de nos clients à Kinshasa. Ajoutez-les au panier, commandez sur WhatsApp et payez
                cash à la livraison.
              </p>
            </Reveal>
          </div>
          <Reveal delai={0.24} className="hidden md:block">
            <ButtonLink href="/boutique/" variante="secondaire" className="group">
              Voir toute la boutique
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {selection.map((produit, i) => (
            <li key={produit.id}>
              <ProductCard produit={produit} index={i} />
            </li>
          ))}
        </ul>

        <Reveal className="mt-10 flex justify-center sm:mt-14 md:hidden">
          <ButtonLink href="/boutique/" className="group w-full sm:w-auto">
            Voir toute la boutique
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </ButtonLink>
        </Reveal>
        <Reveal className="mt-14 hidden justify-center md:flex">
          <ButtonLink href="/boutique/" className="group">
            Découvrir les {produits.length} produits
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
