import { produits } from "@/lib/catalogue";

// À COMPLÉTER (agent fiche produit)
export function generateStaticParams() {
  return produits.map((p) => ({ slug: p.id }));
}

export default function FicheProduit() {
  return <div />;
}
