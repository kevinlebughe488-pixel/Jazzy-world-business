"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getProduit, type Produit } from "@/lib/catalogue";

export type LignePanier = { id: string; quantite: number };
export type LigneDetaillee = { produit: Produit; quantite: number; total: number };

type PanierState = {
  lignes: LignePanier[];
  tiroirOuvert: boolean;
  ajouter: (id: string, quantite?: number) => void;
  retirer: (id: string) => void;
  changerQuantite: (id: string, quantite: number) => void;
  vider: () => void;
  ouvrirTiroir: () => void;
  fermerTiroir: () => void;
};

export const usePanier = create<PanierState>()(
  persist(
    (set) => ({
      lignes: [],
      tiroirOuvert: false,
      ajouter: (id, quantite = 1) =>
        set((s) => {
          const existe = s.lignes.find((l) => l.id === id);
          return {
            lignes: existe
              ? s.lignes.map((l) => (l.id === id ? { ...l, quantite: Math.min(99, l.quantite + quantite) } : l))
              : [...s.lignes, { id, quantite }],
          };
        }),
      retirer: (id) => set((s) => ({ lignes: s.lignes.filter((l) => l.id !== id) })),
      changerQuantite: (id, quantite) =>
        set((s) => ({
          lignes:
            quantite <= 0
              ? s.lignes.filter((l) => l.id !== id)
              : s.lignes.map((l) => (l.id === id ? { ...l, quantite: Math.min(99, quantite) } : l)),
        })),
      vider: () => set({ lignes: [] }),
      ouvrirTiroir: () => set({ tiroirOuvert: true }),
      fermerTiroir: () => set({ tiroirOuvert: false }),
    }),
    {
      name: "jazzy-panier",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lignes: s.lignes }),
    },
  ),
);

/** Lignes enrichies depuis produits.json ; les produits retirés du catalogue sont ignorés. */
export function detaillerLignes(lignes: LignePanier[]): LigneDetaillee[] {
  return lignes.flatMap((l) => {
    const produit = getProduit(l.id);
    return produit ? [{ produit, quantite: l.quantite, total: produit.prix * l.quantite }] : [];
  });
}

export function sousTotal(lignes: LignePanier[]): number {
  return detaillerLignes(lignes).reduce((t, l) => t + l.total, 0);
}

export function nombreArticles(lignes: LignePanier[]): number {
  return detaillerLignes(lignes).reduce((t, l) => t + l.quantite, 0);
}
