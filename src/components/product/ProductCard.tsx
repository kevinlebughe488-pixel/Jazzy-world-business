"use client";

import type { Produit } from "@/lib/catalogue";

// À COMPLÉTER (agent carte produit)
export function ProductCard({ produit }: { produit: Produit; index?: number }) {
  return <div>{produit.nom}</div>;
}
