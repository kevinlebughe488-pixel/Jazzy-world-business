import type { MetadataRoute } from "next";
import { boutique } from "@/lib/catalogue";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: boutique.nom,
    short_name: "Jazzy World",
    description: "Boutique en ligne à Kinshasa : commande sur WhatsApp, livraison partout à Kinshasa, paiement cash à la livraison.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0f1b3d",
    lang: "fr",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
