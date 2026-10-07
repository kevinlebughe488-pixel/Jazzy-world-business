import type { CSSProperties } from "react";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function PanierVide() {
  return (
    <Container className="flex min-h-[72svh] flex-col items-center justify-center pb-20 pt-12 text-center">
      <span className="entree grid size-24 place-items-center rounded-full bg-lin text-encre-doux">
        <ShoppingBag className="size-10" strokeWidth={1.4} aria-hidden="true" />
      </span>
      <h1 className="entree mt-8 font-serif text-6xl leading-[1] tracking-[-0.015em] sm:text-7xl" style={{ "--d": "0.06s" } as CSSProperties}>
        Votre panier est <em>encore vide</em>
      </h1>
      <p className="entree mt-5 max-w-md text-lg leading-relaxed text-encre-doux" style={{ "--d": "0.12s" } as CSSProperties}>
        Découvrez nos produits bien-être, santé et accessoires, livrés partout à Kinshasa avec paiement cash à la
        livraison.
      </p>
      <div className="entree mt-9" style={{ "--d": "0.18s" } as CSSProperties}>
        <ButtonLink href="/boutique/" fleche>
          Voir la boutique
        </ButtonLink>
      </div>
    </Container>
  );
}
