import { ArrowUpRight, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { boutique } from "@/lib/catalogue";
import { lienWhatsApp, messageQuestion } from "@/lib/whatsapp";

const lienDiscret =
  "group flex min-h-12 items-center gap-3 border-t border-papier/15 py-3 text-papier/80 transition-colors hover:text-papier focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-papier";

/** Fin de l'accueil : une carte sombre pour écrire à la boutique. */
export function Contact() {
  return (
    <section aria-labelledby="titre-contact" className="pb-20 sm:pb-28">
      <Container>
        <Reveal>
          <div className="grid gap-12 rounded-[1.75rem] bg-encre px-6 py-12 text-papier sm:px-12 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:px-16 lg:py-20">
            <div>
              <h2 id="titre-contact" className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-7xl">
                Une question&nbsp;? <em className="block text-ocre">Écrivez-nous.</em>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-papier/70">
                Disponibilité, livraison, conseil produit : on vous répond directement sur WhatsApp.
              </p>
            </div>

            <div>
              <ButtonLink href={lienWhatsApp(messageQuestion())} externe variante="whatsapp" className="w-full">
                <WhatsAppIcon className="size-5" />
                Écrire sur WhatsApp
              </ButtonLink>
              <div className="mt-6">
                <a href={`tel:+${boutique.whatsapp}`} className={lienDiscret}>
                  <Phone className="size-4" aria-hidden="true" />
                  <span className="tabular-nums">{boutique.whatsappAffiche}</span>
                  <span className="ml-auto text-sm text-papier/55">Appeler</span>
                </a>
                <a href={boutique.facebook} target="_blank" rel="noopener noreferrer" className={lienDiscret}>
                  <FacebookIcon className="size-4" />
                  <span>Suivre la boutique sur Facebook</span>
                  <ArrowUpRight
                    className="ml-auto size-4 text-papier/55 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
