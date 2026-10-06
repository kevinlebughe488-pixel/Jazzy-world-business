import type { Metadata } from "next";
import { BoutiqueClient } from "./BoutiqueClient";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez tous nos produits bien-être, santé, beauté et accessoires. Livraison partout à Kinshasa, paiement cash à la livraison, commande facile sur WhatsApp.",
  alternates: { canonical: "/boutique/" },
};

export default function Boutique() {
  return <BoutiqueClient />;
}
