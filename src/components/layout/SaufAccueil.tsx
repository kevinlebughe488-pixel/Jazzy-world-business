"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const PAGES_AVEC_BANDEAU = ["/", "/infos"];

/** Affiche son contenu partout sauf sur les pages qui ont déjà leur propre bandeau WhatsApp (accueil, infos). */
export function SaufAccueil({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const normalise = (chemin ?? "/").replace(/\/+$/, "") || "/";
  if (PAGES_AVEC_BANDEAU.includes(normalise)) return null;
  return <>{children}</>;
}
