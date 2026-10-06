"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useProgression } from "@/components/animations/useProgression";
import { boutique } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

/**
 * Final de la page d'accueil : « Une question ? » grossit pendant qu'un cercle noir
 * part du centre et envahit l'écran (le texte s'inverse en passant dessus),
 * puis l'appel à écrire sur WhatsApp apparaît. Enchaîne sur le pied de page noir.
 */
export function GrandFinal() {
  const section = useRef<HTMLElement>(null);
  // Avec « réduire les animations » : directement l'état final (fond noir + contact).
  const p = useProgression(section, ["start start", "end end"], true, 1);

  const texteEchelle = useTransform(p, [0, 0.6], [1, 3.4]);
  const texteOpacite = useTransform(p, [0.38, 0.6], [1, 0]);
  const rideau = useTransform(p, [0.12, 0.68], ["circle(3% at 50% 50%)", "circle(75% at 50% 50%)"]);
  const contenuOpacite = useTransform(p, [0.62, 0.86], [0, 1]);
  const contenuY = useTransform(p, [0.62, 0.92], [90, 0]);

  return (
    <section ref={section} aria-labelledby="titre-grand-final" className="relative h-[230svh] motion-reduce:h-auto">
      <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden bg-white motion-reduce:relative">
        {/* Cercle noir + contenu */}
        <motion.div
          style={{ clipPath: rideau }}
          className="absolute inset-0 flex items-center justify-center bg-noir px-4 pt-16 text-white motion-reduce:relative"
        >
          <motion.div style={{ opacity: contenuOpacite, y: contenuY }} className="flex max-w-3xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2.5 border border-white/30 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.3em]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              Réponse rapide
            </span>

            <h2
              id="titre-grand-final"
              className="mt-6 font-affiche text-[15vw] uppercase leading-[0.86] tracking-[0.01em] sm:text-8xl lg:text-9xl"
            >
              Écrivez-nous
              <br />
              <span className="texte-contour-blanc [-webkit-text-stroke-width:2px]">sur WhatsApp</span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Disponibilité, livraison, conseil produit : on vous répond directement, sans détour.
            </p>

            <a
              href={`tel:+${boutique.whatsapp}`}
              aria-label={`Appeler le ${boutique.whatsappAffiche}`}
              className="mt-7 inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight tabular-nums transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-3xl"
            >
              <span className="grid size-10 place-items-center border border-white/30">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              {boutique.whatsappAffiche}
            </a>

            <ButtonLink href={lienWhatsApp(messageQuestion())} externe variante="inverse" className="mt-8 w-full max-w-xs sm:w-auto sm:max-w-none">
              <WhatsAppIcon className="size-5" />
              Écrire sur WhatsApp
            </ButtonLink>
            <p className="mt-5 text-[0.66rem] font-bold uppercase tracking-[0.3em] text-white/50">
              Livraison partout à Kinshasa · Paiement cash
            </p>
          </motion.div>
        </motion.div>

        {/* Texte géant qui s'inverse au passage du cercle */}
        <motion.p
          aria-hidden="true"
          style={{ scale: texteEchelle, opacity: texteOpacite }}
          className="pointer-events-none absolute inset-0 grid place-items-center text-center font-affiche text-[21vw] uppercase leading-[0.85] text-white mix-blend-difference motion-reduce:hidden lg:text-[17vw]"
        >
          <span>
            Une
            <br />
            question&nbsp;?
          </span>
        </motion.p>
      </div>
    </section>
  );
}
