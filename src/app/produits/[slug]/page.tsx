import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { boutique, getCategorie, getProduit, produits, type Produit } from "@/lib/catalogue";
import { Galerie } from "./Galerie";
import { PanneauAchat } from "./PanneauAchat";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return produits.map((p) => ({ slug: p.id }));
}

function descriptionCourte(produit: Produit): string {
  const base = produit.accroche.trim() || produit.description.trim();
  const texte = base
    ? base
    : `${produit.nom} à ${produit.prix} $ chez ${boutique.nom}.`;
  const resume = texte.length > 150 ? `${texte.slice(0, 147).trimEnd()}…` : texte;
  return `${resume} Livraison partout à Kinshasa, paiement cash à la livraison. Commandez sur WhatsApp.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produit = getProduit(slug);
  if (!produit) return { title: "Produit introuvable" };
  const titre = `${produit.nom} | ${boutique.nom}`;
  const description = descriptionCourte(produit);
  const image = produit.images[0];
  return {
    title: produit.nom,
    description,
    alternates: { canonical: `/produits/${produit.id}/` },
    openGraph: {
      title: titre,
      description,
      type: "website",
      locale: "fr_CD",
      siteName: boutique.nom,
      images: image ? [{ url: image, alt: produit.nom }] : undefined,
    },
    twitter: { card: "summary_large_image", title: titre, description, images: image ? [image] : undefined },
  };
}

/** Produits suggérés : même catégorie d'abord, puis le reste du catalogue. */
function suggestions(produit: Produit, nombre = 4): Produit[] {
  const autres = produits.filter((p) => p.id !== produit.id && p.enStock);
  const memeCategorie = autres.filter((p) => p.categorie === produit.categorie);
  const reste = autres.filter((p) => p.categorie !== produit.categorie);
  return [...memeCategorie, ...reste].slice(0, nombre);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const produit = getProduit(slug);
  if (!produit) notFound();

  const categorie = getCategorie(produit.categorie);
  const similaires = suggestions(produit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produit.nom,
    image: produit.images,
    description: descriptionCourte(produit),
    category: categorie?.nom,
    brand: { "@type": "Brand", name: boutique.nom },
    offers: {
      "@type": "Offer",
      price: produit.prix,
      priceCurrency: boutique.devise,
      availability: produit.enStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="relative overflow-x-clip pb-28 pt-24 lg:pb-24 lg:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Halo décoratif */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] overflow-hidden">
        <div className="absolute -left-40 -top-32 size-[32rem] rounded-full bg-violet-300/25 blur-[110px]" />
        <div className="absolute -right-32 top-10 size-[28rem] rounded-full bg-ciel-200/50 blur-[110px]" />
      </div>

      <Container>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="mb-6 lg:mb-10">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-nuit/60">
            <li>
              <Link
                href="/"
                className="rounded-md px-1 py-1.5 transition-colors hover:text-violet focus-visible:outline-2 focus-visible:outline-violet"
              >
                Accueil
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-nuit/30" />
            </li>
            <li>
              <Link
                href="/boutique/"
                className="rounded-md px-1 py-1.5 transition-colors hover:text-violet focus-visible:outline-2 focus-visible:outline-violet"
              >
                Boutique
              </Link>
            </li>
            {categorie && (
              <>
                <li aria-hidden>
                  <ChevronRight className="size-3.5 text-nuit/30" />
                </li>
                <li className="px-1 py-1.5">{categorie.nom}</li>
              </>
            )}
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-nuit/30" />
            </li>
            <li aria-current="page" className="max-w-[14rem] truncate px-1 py-1.5 font-medium text-nuit">
              {produit.nom}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Galerie images={produit.images} nom={produit.nom} />
          </div>
          <div>
            <PanneauAchat produit={produit} categorie={categorie?.nom} />
          </div>
        </div>
      </Container>

      {similaires.length > 0 && (
        <section aria-labelledby="titre-similaires" className="mt-24 lg:mt-32">
          <Container>
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet">À découvrir</p>
                <h2 id="titre-similaires" className="mt-2 font-display text-3xl font-bold text-nuit sm:text-4xl">
                  Vous aimerez <span className="texte-degrade">aussi</span>
                </h2>
              </div>
              <Link
                href="/boutique/"
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 font-semibold text-nuit transition-colors hover:text-violet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
              >
                Voir toute la boutique
                <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {similaires.map((p, i) => (
                <ProductCard key={p.id} produit={p} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
