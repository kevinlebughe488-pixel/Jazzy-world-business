"use client";

import { usePanier } from "@/lib/cart";
import { Button } from "@/components/ui/Button";

// À COMPLÉTER (agent carte produit) : animation de la photo qui vole vers #icone-panier.
export function AddToCartButton({
  produitId,
  quantite = 1,
  className,
}: {
  produitId: string;
  quantite?: number;
  /** Image à faire voler vers le panier (src de la photo produit). */
  image?: string;
  className?: string;
  compact?: boolean;
}) {
  const ajouter = usePanier((s) => s.ajouter);
  return (
    <Button className={className} onClick={() => ajouter(produitId, quantite)}>
      Ajouter au panier
    </Button>
  );
}
