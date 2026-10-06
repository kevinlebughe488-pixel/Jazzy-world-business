import data from "@/data/produits.json";

export type Categorie = { id: string; nom: string };

export type Produit = {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  accroche: string;
  description: string;
  pointsForts: string[];
  images: string[];
  enStock: boolean;
  vedette: boolean;
};

export const boutique = data.boutique;
export const categories: Categorie[] = data.categories;
export const produits: Produit[] = data.produits;

export function getProduit(id: string): Produit | undefined {
  return produits.find((p) => p.id === id);
}

export function getCategorie(id: string): Categorie | undefined {
  return categories.find((c) => c.id === id);
}

export const produitsVedettes = produits.filter((p) => p.vedette);
