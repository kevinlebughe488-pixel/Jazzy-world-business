import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { boutique } from "@/lib/catalogue";
import { formatFC } from "@/lib/format";

const ETAPES = [
  { titre: "Choisissez vos produits", texte: "Bien-être, beauté, accessoires." },
  { titre: "Ajoutez au panier", texte: "Il reste gardé sur votre téléphone." },
  { titre: "Envoyez sur WhatsApp", texte: "Le message est déjà écrit pour vous." },
  { titre: "Payez à la livraison", texte: "En cash, en recevant le colis." },
];

/* Code-barres décoratif (largeurs fixes : identique au serveur et au navigateur). */
const BARRES = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 1, 3, 2];

/** « Commander en 4 étapes » : un ticket de caisse posé sur la table, à côté du texte. */
export function CommentCommander() {
  return (
    <section id="comment-commander" aria-labelledby="titre-comment-commander" className="scroll-mt-24 py-20 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* ---------- Texte ---------- */}
        <Reveal className="lg:order-2">
          <p className="etiquette">Simple comme bonjour</p>
          <h2
            id="titre-comment-commander"
            className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl"
          >
            Commander en <em>4 étapes</em>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-encre-doux">
            Pas de compte, pas de carte bancaire. Votre commande part en un message WhatsApp et vous payez à la
            réception.
          </p>
          <ButtonLink href="/infos/" variante="secondaire" className="mt-8">
            Livraison &amp; infos
          </ButtonLink>
        </Reveal>

        {/* ---------- Ticket ---------- */}
        <Reveal delai={0.1} className="lg:order-1">
          <div className="relative mx-auto w-full max-w-[22rem] -rotate-[1.5deg] drop-shadow-[0_18px_26px_rgb(70_52_24/0.16)] sm:max-w-sm">
            <span aria-hidden="true" className="ruban -top-3 left-1/2 z-10 -translate-x-1/2 rotate-2 bg-sauge/75" />
            <div className="bg-carte px-6 pb-6 pt-7 font-mono text-[0.74rem] uppercase leading-relaxed text-encre sm:px-7 sm:text-[0.78rem]">
              <p className="text-center text-[0.85rem] font-bold tracking-[0.16em]">{boutique.nom}</p>
              <p className="text-center text-muet">Kinshasa, RD Congo</p>
              <Pointilles />

              <ol className="space-y-3">
                {ETAPES.map((e, i) => (
                  <li key={e.titre} className="flex gap-3">
                    <span className="text-muet">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="font-bold">{e.titre}</span>
                      <span className="block normal-case text-encre-doux">{e.texte}</span>
                    </span>
                    <span aria-hidden="true" className="text-sauge-fonce">
                      ✓
                    </span>
                  </li>
                ))}
              </ol>

              <Pointilles />
              <div className="space-y-1">
                <LigneTotal libelle="Compte à créer" valeur="Aucun" />
                <LigneTotal libelle="Paiement en ligne" valeur="0 $" />
                <LigneTotal libelle="Livraison" valeur={`dès ${formatFC(boutique.livraison.prixMinFC)}`} />
                <div className="mt-2 border-t-4 border-double border-encre pt-2">
                  <LigneTotal libelle="Total" valeur="Cash à la livraison" gras />
                </div>
              </div>

              {/* Code-barres et tampon */}
              <div className="relative mt-6">
                <div aria-hidden="true" className="flex h-10 w-fit items-stretch gap-[2px]">
                  {BARRES.map((l, i) => (
                    <span key={i} className={i % 2 ? "bg-transparent" : "bg-encre"} style={{ width: l * 2 }} />
                  ))}
                </div>
                <p
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 right-0 -rotate-[11deg] rounded-[4px] border-2 border-argile px-3 py-1 text-center font-serif normal-case leading-none text-argile-fonce mix-blend-multiply"
                >
                  <span className="block text-3xl italic">Payé cash</span>
                  <span className="block font-mono text-[0.55rem] uppercase tracking-[0.25em]">à la livraison</span>
                </p>
              </div>
              <p className="mt-3 text-center font-bold tracking-[0.16em]">Merci, matondo mingi !</p>
            </div>
            {/* Bord déchiré */}
            <div
              aria-hidden="true"
              className="h-2.5 bg-[length:14px_10px] bg-repeat-x"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--color-carte) 50%, transparent 50%), linear-gradient(-135deg, var(--color-carte) 50%, transparent 50%)",
              }}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Pointilles() {
  return <div aria-hidden="true" className="my-4 border-t border-dashed border-trait-fort" />;
}

function LigneTotal({ libelle, valeur, gras }: { libelle: string; valeur: string; gras?: boolean }) {
  return (
    <div className={gras ? "flex items-baseline gap-2 font-bold" : "flex items-baseline gap-2"}>
      <span className="shrink-0">{libelle}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-trait-fort" />
      <span className="shrink-0 text-right">{valeur}</span>
    </div>
  );
}
