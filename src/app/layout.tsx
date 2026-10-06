import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

const SITE_URL = "https://jazzy-world-business.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jazzy World Business | Boutique en ligne à Kinshasa",
    template: "%s | Jazzy World Business",
  },
  description:
    "Boutique en ligne à Kinshasa : bien-être, santé, beauté et accessoires. Commandez sur WhatsApp, livraison partout à Kinshasa dès 8 000 FC, paiement cash à la livraison.",
  applicationName: "Jazzy World Business",
  keywords: [
    "Kinshasa",
    "boutique en ligne",
    "RDC",
    "livraison Kinshasa",
    "paiement à la livraison",
    "WhatsApp",
    "Jazzy World Business",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: "/",
    siteName: "Jazzy World Business",
    title: "Jazzy World Business | Boutique en ligne à Kinshasa",
    description: "Commandez sur WhatsApp. Livraison partout à Kinshasa, paiement cash à la livraison.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jazzy World Business | Boutique en ligne à Kinshasa",
    description: "Commandez sur WhatsApp. Livraison partout à Kinshasa, paiement cash à la livraison.",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${anton.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main id="contenu" className="min-h-screen overflow-x-clip pt-8">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
