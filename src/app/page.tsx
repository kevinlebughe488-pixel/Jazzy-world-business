import { Hero } from "@/components/home/Hero";
import { Manifeste } from "@/components/home/Manifeste";
import { ProduitsVedettes } from "@/components/home/ProduitsVedettes";
import { CommentCommander } from "@/components/home/CommentCommander";
import { GrandFinal } from "@/components/home/GrandFinal";

/*
 * Accueil : l'intensité des animations monte au fil du défilement.
 * Hero qui explose → bandeaux qui accélèrent → vitrine horizontale
 * → ticket de caisse imprimé au défilement → cercle noir final.
 */
export default function Accueil() {
  return (
    <>
      <Hero />
      <Manifeste />
      <ProduitsVedettes />
      <CommentCommander />
      <GrandFinal />
    </>
  );
}
