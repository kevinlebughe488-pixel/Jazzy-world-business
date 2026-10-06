import type { Metadata } from "next";
import { PanierClient } from "./PanierClient";

export const metadata: Metadata = {
  title: "Mon panier",
  description:
    "Vérifiez votre panier et envoyez votre commande sur WhatsApp. Livraison partout à Kinshasa, paiement cash à la livraison.",
  robots: { index: false, follow: false },
};

export default function PagePanier() {
  return <PanierClient />;
}
