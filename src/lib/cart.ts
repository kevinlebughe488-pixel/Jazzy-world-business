"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
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

const CLE_PANIER = "jazzy-panier";

/**
 * Accès au stockage du navigateur qui ne lève jamais d'erreur
 * (stockage bloqué, navigation privée, mémoire pleine) : le panier
 * continue alors de fonctionner en mémoire pendant la visite.
 */
const stockageSur: StateStorage = {
  getItem: (nom) => {
    try {
      return window.localStorage.getItem(nom);
    } catch {
      return null;
    }
  },
  setItem: (nom, valeur) => {
    try {
      window.localStorage.setItem(nom, valeur);
    } catch {
      /* stockage indisponible ou plein : on garde le panier en mémoire */
    }
  },
  removeItem: (nom) => {
    try {
      window.localStorage.removeItem(nom);
    } catch {
      /* idem */
    }
  },
};

/** Ne garde que des lignes valides (id texte, quantité entière entre 1 et 99) : des données abîmées ne cassent pas le site. */
function nettoyerLignes(brut: unknown): LignePanier[] {
  if (!Array.isArray(brut)) return [];
  const vues = new Set<string>();
  return brut.flatMap((l) => {
    if (!l || typeof l !== "object") return [];
    const { id, quantite } = l as Partial<LignePanier>;
    if (typeof id !== "string" || vues.has(id) || typeof quantite !== "number" || !Number.isFinite(quantite)) return [];
    vues.add(id);
    return [{ id, quantite: Math.min(99, Math.max(1, Math.round(quantite))) }];
  });
}

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
              : [...s.lignes, { id, quantite: Math.min(99, quantite) }],
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
      name: CLE_PANIER,
      storage: createJSONStorage(() => stockageSur),
      partialize: (s) => ({ lignes: s.lignes }),
      merge: (enregistre, actuel) => ({
        ...actuel,
        lignes: nettoyerLignes((enregistre as Partial<PanierState> | undefined)?.lignes),
      }),
    },
  ),
);

/**
 * Garde le panier identique entre plusieurs onglets ouverts :
 * quand un autre onglet le modifie, celui-ci recharge la version enregistrée.
 * Renvoie la fonction qui arrête l'écoute.
 */
export function synchroniserPanierEntreOnglets(): () => void {
  const surChangement = (e: StorageEvent) => {
    if (e.key === CLE_PANIER || e.key === null) void usePanier.persist.rehydrate();
  };
  window.addEventListener("storage", surChangement);
  return () => window.removeEventListener("storage", surChangement);
}

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
