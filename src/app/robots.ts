import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// À modifier si le site est publié sur un autre domaine.
const SITE_URL = "https://jazzy-world-business.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/panier/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
