import { Hero } from "@/components/home/Hero";
import { Assurances } from "@/components/home/Assurances";
import { ProduitsVedettes } from "@/components/home/ProduitsVedettes";
import { CommentCommander } from "@/components/home/CommentCommander";
import { Contact } from "@/components/home/Contact";

/*
 * Accueil, au calme : titre et tirages photo → promesses (livraison, paiement, commande)
 * → produits phares → ticket des 4 étapes → carte contact.
 */
export default function Accueil() {
  return (
    <>
      <Hero />
      <Assurances />
      <ProduitsVedettes />
      <CommentCommander />
      <Contact />
    </>
  );
}
