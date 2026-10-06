import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Jazzy World Business",
  description: "Boutique en ligne à Kinshasa. Commande sur WhatsApp, paiement cash à la livraison.",
};

export const viewport: Viewport = {
  themeColor: "#241a52",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          <Header />
          <main id="contenu" className="min-h-screen">
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
