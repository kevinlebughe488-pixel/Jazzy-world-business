import { boutique } from "@/lib/catalogue";
import { detaillerLignes, type LignePanier } from "@/lib/cart";
import { formatFC, formatUSD } from "@/lib/format";

export type InfosClient = { nom?: string; commune?: string; adresse?: string; telephone?: string };

export function lienWhatsApp(message: string): string {
  return `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function messageCommande(lignes: LignePanier[], client: InfosClient = {}): string {
  const details = detaillerLignes(lignes);
  const total = details.reduce((t, l) => t + l.total, 0);
  const articles = details.map((l) => `• ${l.quantite} × ${l.produit.nom} = ${formatUSD(l.total)}`);
  const adresse = [client.commune, client.adresse].filter(Boolean).join(", ");
  return [
    `Bonjour ${boutique.nom} 👋`,
    "Je souhaite commander :",
    "",
    ...articles,
    "",
    `Sous-total : ${formatUSD(total)}`,
    `Livraison : à confirmer (à partir de ${formatFC(boutique.livraison.prixMinFC)})`,
    `Paiement : ${boutique.paiement.toLowerCase()}`,
    "",
    `Nom : ${client.nom?.trim() || "…"}`,
    `Commune / adresse : ${adresse.trim() || "…"}`,
    `Téléphone : ${client.telephone?.trim() || "…"}`,
  ].join("\n");
}

export function messageQuestion(nomProduit?: string): string {
  return nomProduit
    ? `Bonjour ${boutique.nom} 👋 Je suis intéressé(e) par : ${nomProduit}. Est-il disponible ?`
    : `Bonjour ${boutique.nom} 👋 J'ai une question.`;
}
