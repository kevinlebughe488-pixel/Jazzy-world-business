import { Hero } from "@/components/home/Hero";
import { Avantages } from "@/components/home/Avantages";
import { ProduitsVedettes } from "@/components/home/ProduitsVedettes";
import { CommentCommander } from "@/components/home/CommentCommander";
import { BandeauWhatsApp } from "@/components/home/BandeauWhatsApp";

export default function Accueil() {
  return (
    <>
      <Hero />
      <Avantages />
      <ProduitsVedettes />
      <CommentCommander />
      <BandeauWhatsApp />
    </>
  );
}
