"use client";

import { useSyncExternalStore } from "react";

const abonnementVide = () => () => {};

/** false au rendu serveur et pendant l'hydratation, true ensuite (évite les écarts serveur/client). */
export function useMonte(): boolean {
  return useSyncExternalStore(
    abonnementVide,
    () => true,
    () => false,
  );
}
