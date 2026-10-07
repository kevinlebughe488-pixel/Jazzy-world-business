import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { getCategorie, type Produit } from "@/lib/catalogue";
import { formatUSD } from "@/lib/format";
import { AddToCartButton } from "@/components/product/AddToCartButton";

/**
 * Carte produit : photo arrondie dans une carte claire, nom, prix en serif et bouton d'ajout rond.
 * `grand` : version mise en avant (la photo occupe toute la hauteur disponible sur ordinateur).
 */
export function ProductCard({
  produit,
  grand = false,
  prioritaire = false,
  className,
}: {
  produit: Produit;
  grand?: boolean;
  prioritaire?: boolean;
  className?: string;
}) {
  const categorie = getCategorie(produit.categorie);
  const [image1, image2] = produit.images;
  const lien = `/produits/${produit.id}/`;
  const accroche = produit.accroche?.trim();
  const tailles = grand
    ? "(min-width: 1024px) 50vw, 100vw"
    : "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 50vw";

  return (
    <article
      className={clsx(
        "group relative flex h-full flex-col rounded-carte bg-carte p-2 shadow-doux transition-[box-shadow,translate] duration-500 ease-[var(--ease-doux)] hover:-translate-y-1 hover:shadow-releve has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-encre",
        className,
      )}
    >
      {/* Photo */}
      <div
        className={clsx(
          "relative overflow-hidden rounded-media bg-lin",
          grand ? "aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:min-h-0 lg:flex-1" : "aspect-[4/5]",
        )}
      >
        {image1 && (
          <Image
            src={image1}
            alt={`${produit.nom} - Jazzy World Business`}
            fill
            priority={prioritaire}
            sizes={tailles}
            className={clsx(
              "object-cover transition-[transform,opacity] duration-700 ease-[var(--ease-doux)] group-hover:scale-[1.03]",
              image2 && "[@media(hover:hover)]:group-hover:opacity-0",
            )}
          />
        )}
        {image2 && (
          <Image
            src={image2}
            alt=""
            aria-hidden
            fill
            sizes={tailles}
            className="hidden object-cover opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-doux)] group-hover:scale-[1.03] [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:opacity-100"
          />
        )}
      </div>

      {/* Texte */}
      <div className={clsx("flex flex-col px-2 pb-2 pt-3.5 sm:px-2.5", grand ? "sm:pt-5" : "flex-1")}>
        {categorie && <p className="text-xs text-muet">{categorie.nom}</p>}
        <h3 className={clsx("mt-1 font-medium leading-snug", grand ? "font-serif text-3xl font-normal sm:text-4xl" : "text-[0.95rem]")}>
          {/* Le lien couvre toute la carte ; le bouton d'ajout reste au-dessus (z-10). */}
          <Link href={lien} className="outline-none after:absolute after:inset-0 after:z-[1] after:rounded-carte after:content-['']">
            <span className="line-clamp-2">{produit.nom}</span>
          </Link>
        </h3>
        {accroche ? (
          <p className={clsx("mt-1 text-sm leading-snug text-muet", grand ? "line-clamp-2 max-w-md" : "hidden line-clamp-2 sm:block")}>
            {accroche}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className={clsx("font-serif leading-none", grand ? "text-4xl" : "text-[1.7rem]")}>
            <span className="sr-only">Prix : </span>
            {formatUSD(produit.prix)}
          </p>
          {produit.enStock ? (
            <div className="relative z-10">
              <AddToCartButton produitId={produit.id} image={image1} compact />
            </div>
          ) : (
            <p className="text-right text-xs font-medium text-argile-fonce">Bientôt de retour</p>
          )}
        </div>
      </div>
    </article>
  );
}
