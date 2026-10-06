"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Undo2 } from "lucide-react";
import { getProduit } from "@/lib/catalogue";
import { usePanier, detaillerLignes } from "@/lib/cart";
import { Container } from "@/components/ui/Container";
import { PanierVide } from "./PanierVide";
import { PanierContenu } from "./PanierContenu";

const abonnement = () => () => {};

/** true seulement côté client, après l'hydratation (évite les écarts serveur/client). */
function useMonte() {
  return useSyncExternalStore(
    abonnement,
    () => true,
    () => false,
  );
}

export function PanierClient() {
  const monte = useMonte();
  const lignes = usePanier((s) => s.lignes);
  const retirer = usePanier((s) => s.retirer);
  const ajouter = usePanier((s) => s.ajouter);
  const reduire = useReducedMotion();
  const vide = detaillerLignes(lignes).length === 0;

  // Dernier article retiré, pour proposer « Annuler » pendant quelques secondes.
  const [retrait, setRetrait] = useState<{
    id: string;
    quantite: number;
    nom: string;
    n: number;
  } | null>(null);
  useEffect(() => {
    if (!retrait) return;
    const t = window.setTimeout(() => setRetrait(null), 5000);
    return () => window.clearTimeout(t);
  }, [retrait]);

  const onRetirer = useCallback(
    (id: string, quantite: number) => {
      retirer(id);
      setRetrait({
        id,
        quantite,
        nom: getProduit(id)?.nom ?? "Article",
        n: Date.now(),
      });
    },
    [retirer],
  );
  const annuler = () => {
    if (!retrait) return;
    ajouter(retrait.id, retrait.quantite);
    setRetrait(null);
  };

  if (!monte) return <Squelette />;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {vide ? (
          <motion.div
            key="vide"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PanierVide />
          </motion.div>
        ) : (
          <motion.div
            key="contenu"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PanierContenu onRetirer={onRetirer} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-24 z-40 flex justify-center px-4 lg:top-28"
      >
        <AnimatePresence>
          {retrait && (
            <motion.div
              key={retrait.n}
              initial={
                reduire ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.95 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduire ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.95 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex max-w-md items-center gap-3 bg-noir py-1.5 pr-1.5 pl-5 text-sm text-white"
            >
              <span className="min-w-0 truncate">
                <span className="font-semibold">{retrait.nom}</span> retiré du
                panier
              </span>
              <button
                type="button"
                onClick={annuler}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 bg-white/15 px-4 font-semibold transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gris-300"
              >
                <Undo2 className="size-4" aria-hidden="true" />
                Annuler
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/** Rendu serveur / avant montage : structure neutre, sans contenu du panier. */
function Squelette() {
  return (
    <Container className="pt-24 pb-24 lg:pt-32">
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-4 w-28 bg-gris-100" />
        <div className="mt-4 h-10 w-56 bg-gris-100" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/70 ring-1 ring-gris-200"
              />
            ))}
          </div>
          <div className="h-96 bg-white/70 ring-1 ring-gris-200" />
        </div>
      </div>
      <span className="sr-only">Chargement du panier…</span>
    </Container>
  );
}
