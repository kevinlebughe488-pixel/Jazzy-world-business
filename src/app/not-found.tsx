import type { Metadata } from "next";
import { PageIntrouvable } from "@/components/erreur/PageIntrouvable";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <PageIntrouvable />;
}
