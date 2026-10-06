import type { MetadataRoute } from "next";
import { produits } from "@/lib/catalogue";

export const dynamic = "force-static";

// À modifier si le site est publié sur un autre domaine.
const SITE_URL = "https://jazzy-world-business.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const maintenant = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: maintenant, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/boutique/`, lastModified: maintenant, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/infos/`, lastModified: maintenant, changeFrequency: "monthly", priority: 0.6 },
  ];
  const fiches: MetadataRoute.Sitemap = produits.map((p) => ({
    url: `${SITE_URL}/produits/${p.id}/`,
    lastModified: maintenant,
    changeFrequency: "weekly",
    priority: 0.8,
    images: p.images.map((img) => `${SITE_URL}${img}`),
  }));
  return [...pages, ...fiches];
}
