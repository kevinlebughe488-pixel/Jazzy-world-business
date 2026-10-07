import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
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
    <div className="pb-28 pt-6 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Container>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="mb-6 lg:mb-8">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muet">
            <li>
              <Link
                href="/"
                className="rounded px-1 py-1.5 transition-colors hover:text-encre focus-visible:outline-2 focus-visible:outline-encre"
              >
                Accueil
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-trait-fort" />
            </li>
            <li>
              <Link
                href="/boutique/"
                className="rounded px-1 py-1.5 transition-colors hover:text-encre focus-visible:outline-2 focus-visible:outline-encre"
              >
                Boutique
              </Link>
            </li>
            {categorie && (
              <>
                <li aria-hidden>
                  <ChevronRight className="size-3.5 text-trait-fort" />
                </li>
                <li className="px-1 py-1.5">{categorie.nom}</li>
              </>
            )}
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-trait-fort" />
            </li>
            <li aria-current="page" className="max-w-[14rem] truncate px-1 py-1.5 text-encre">
              {produit.nom}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
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
              <h2 id="titre-similaires" className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl">
                Vous aimerez <em>aussi</em>
              </h2>
              <Link
                href="/boutique/"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full text-[0.95rem] font-medium text-encre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
              >
                Voir la boutique
                <span className="grid size-9 place-items-center rounded-full bg-encre text-papier transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {similaires.map((p, i) => (
                <Reveal key={p.id} delai={i * 0.06} className="h-full">
                  <ProductCard produit={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
