"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  ChevronDown,
  CircleAlert,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import clsx from "clsx";
import {
  usePanier,
  detaillerLignes,
  sousTotal,
  nombreArticles,
} from "@/lib/cart";
import { boutique } from "@/lib/catalogue";
import { formatFC, formatUSD } from "@/lib/format";
import { lienWhatsApp, messageCommande } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { LigneCommande } from "./LigneCommande";
import { ApercuWhatsApp } from "./ApercuWhatsApp";
import { ModaleSucces } from "./ModaleSucces";
import {
  COMMUNES,
  enregistrerClient,
  lireClient,
  valider,
  type ChampRequis,
  type Client,
} from "./donnees";

const ease = [0.16, 1, 0.3, 1] as const;
const ORDRE_CHAMPS: ChampRequis[] = ["nom", "telephone", "commune"];

export function PanierContenu({
  onRetirer,
}: {
  onRetirer: (id: string, quantite: number) => void;
}) {
  const lignes = usePanier((s) => s.lignes);
  const vider = usePanier((s) => s.vider);
  const reduire = useReducedMotion();

  const details = useMemo(() => detaillerLignes(lignes), [lignes]);
  const total = sousTotal(lignes);
  const articles = nombreArticles(lignes);

  // Ce composant n'est rendu qu'après montage : lecture directe du localStorage sans risque d'hydratation.
  const [client, setClient] = useState<Client>(lireClient);
  const [tente, setTente] = useState(false);
  const [secousse, setSecousse] = useState(0);
  const [succes, setSucces] = useState(false);
  const erreurs = tente ? valider(client) : {};


  const message = messageCommande(lignes, client);
  const lien = lienWhatsApp(message);

  const [scopeForm, animer] = useAnimate<HTMLFormElement>();
  useEffect(() => {
    if (!secousse || reduire || !scopeForm.current) return;
    if (!scopeForm.current.querySelector("[data-invalide='true']")) return;
    animer(
      "[data-invalide='true']",
      { x: [0, -10, 10, -7, 7, -3, 0] },
      { duration: 0.5, ease: "easeInOut" },
    );
  }, [secousse, reduire, animer, scopeForm]);

  const boutonPrincipal = useRef<HTMLDivElement>(null);
  const principalVisible = useInView(boutonPrincipal, {
    margin: "0px 0px -40px 0px",
  });

  // Enregistré seulement quand le client tape : un autre onglet resté ouvert sur le panier
  // n'écrase pas ce qui vient d'être saisi ailleurs.
  const changer = (champ: keyof Client) => (valeur: string) => {
    const suivant = { ...client, [champ]: valeur };
    setClient(suivant);
    enregistrerClient(suivant);
  };

  const commander = (e: MouseEvent<HTMLAnchorElement>) => {
    const err = valider(client);
    const premier = ORDRE_CHAMPS.find((c) => err[c]);
    if (premier) {
      e.preventDefault();
      setTente(true);
      setSecousse((n) => n + 1);
      const champ = document.getElementById(`champ-${premier}`);
      champ?.scrollIntoView({
        behavior: reduire ? "auto" : "smooth",
        block: "center",
      });
      champ?.focus({ preventScroll: true });
      return;
    }
    enregistrerClient(client);
    window.setTimeout(() => setSucces(true), 500);
  };

  const fermer = useCallback(() => setSucces(false), []);
  const toutVider = () => {
    setSucces(false);
    vider();
  };

  return (
    <>
      <Container className="pb-40 pt-10 lg:pb-24 lg:pt-14">
        {/* En-tête */}
        <motion.div
          initial={reduire ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <Link
            href="/boutique/"
            className="group -ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[0.95rem] text-muet transition-colors hover:text-encre focus-visible:outline-2 focus-visible:outline-encre"
          >
            <ArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Continuer mes achats
          </Link>
          <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="font-serif text-6xl leading-[1] tracking-[-0.015em] sm:text-7xl">
              Mon <em>panier</em>
            </h1>
            <span className="mb-2 inline-flex items-center rounded-full bg-lin px-3 py-1 text-sm text-encre-doux">
              {articles} article{articles > 1 ? "s" : ""}
            </span>
          </div>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-encre-doux">
            Vérifiez vos articles, indiquez où vous livrer, puis envoyez la
            commande sur WhatsApp. Aucun paiement en ligne.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 xl:gap-14">
          {/* Lignes */}
          <section aria-labelledby="titre-articles">
            <h2 id="titre-articles" className="sr-only">
              Articles du panier
            </h2>
            <ul className="space-y-3 sm:space-y-4">
              <AnimatePresence mode="popLayout" initial={true}>
                {details.map((ligne, i) => (
                  <LigneCommande
                    key={ligne.produit.id}
                    ligne={ligne}
                    index={i}
                    onRetirer={onRetirer}
                  />
                ))}
              </AnimatePresence>
            </ul>

            <motion.ul
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
              initial="cache"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.4 },
                },
              }}
            >
              <Atout
                icone={<Truck className="size-5" aria-hidden="true" />}
                titre="Partout à Kinshasa"
                texte={`Dès ${formatFC(boutique.livraison.prixMinFC)}`}
              />
              <Atout
                icone={<Banknote className="size-5" aria-hidden="true" />}
                titre="Cash à la livraison"
                texte="Payez à la réception"
              />
              <Atout
                icone={<ShieldCheck className="size-5" aria-hidden="true" />}
                titre="Confirmé sur WhatsApp"
                texte="Un vrai conseiller vous répond"
              />
            </motion.ul>
          </section>

          {/* Récapitulatif + formulaire */}
          <motion.aside
            aria-labelledby="titre-recap"
            initial={reduire ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="lg:sticky lg:top-24"
          >
            <div className="rounded-carte bg-carte shadow-doux">
              <div className="p-5 sm:p-7">
                <h2 id="titre-recap" className="font-serif text-4xl leading-none">
                  Récapitulatif
                </h2>

                <dl className="mt-5 space-y-3.5 text-[0.95rem]">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muet">
                      Sous-total ({articles} article{articles > 1 ? "s" : ""})
                    </dt>
                    <dd className="font-medium tabular-nums">
                      <MontantAnime valeur={total} />
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 text-muet">
                      <Truck
                        className="size-4 shrink-0 text-encre-doux"
                        aria-hidden="true"
                      />
                      Livraison
                    </dt>
                    <dd className="max-w-[60%] text-right">
                      <span className="font-medium">
                        à partir de {formatFC(boutique.livraison.prixMinFC)}
                      </span>
                      <span className="block text-xs text-muet">
                        (selon le trajet, confirmé sur WhatsApp)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-muet">
                      <Banknote
                        className="size-4 shrink-0 text-encre-doux"
                        aria-hidden="true"
                      />
                      Paiement
                    </dt>
                    <dd className="font-medium">{boutique.paiement}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-dashed border-trait-fort pt-5">
                  <div>
                    <p className="text-sm font-medium text-encre-doux">
                      Total articles
                    </p>
                    <p className="text-xs text-muet">+ frais de livraison</p>
                  </div>
                  <p className="font-serif text-4xl leading-none">
                    <MontantAnime valeur={total} />
                  </p>
                </div>

                {/* Formulaire */}
                <form
                  ref={scopeForm}
                  noValidate
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-7 space-y-4"
                  aria-labelledby="titre-form"
                >
                  <div>
                    <h3 id="titre-form" className="font-medium">
                      Vos informations de livraison
                    </h3>
                    <p className="mt-0.5 text-sm text-muet">
                      Enregistrées sur cet appareil pour vos prochaines
                      commandes.
                    </p>
                  </div>

                  <Champ
                    id="nom"
                    label="Nom"
                    requis
                    erreur={erreurs.nom}
                    icone={<User className="size-4" aria-hidden="true" />}
                  >
                    {(props) => (
                      <input
                        {...props}
                        type="text"
                        autoComplete="name"
                        placeholder="Votre nom complet"
                        value={client.nom}
                        onChange={(e) => changer("nom")(e.target.value)}
                      />
                    )}
                  </Champ>

                  <Champ
                    id="telephone"
                    label="Téléphone"
                    requis
                    erreur={erreurs.telephone}
                    icone={<Phone className="size-4" aria-hidden="true" />}
                  >
                    {(props) => (
                      <input
                        {...props}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0812 345 678"
                        value={client.telephone}
                        onChange={(e) => changer("telephone")(e.target.value)}
                      />
                    )}
                  </Champ>

                  <Champ
                    id="commune"
                    label="Commune"
                    requis
                    erreur={erreurs.commune}
                    icone={<MapPin className="size-4" aria-hidden="true" />}
                    select
                  >
                    {(props) => (
                      <select
                        {...props}
                        value={client.commune}
                        onChange={(e) => changer("commune")(e.target.value)}
                        className={clsx(
                          props.className,
                          "appearance-none pr-11",
                          !client.commune && "text-muet",
                        )}
                      >
                        <option value="" disabled>
                          Choisir votre commune
                        </option>
                        {COMMUNES.map((c) => (
                          <option key={c} value={c} className="text-encre">
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </Champ>

                  <Champ
                    id="adresse"
                    label="Adresse / repère"
                    aide="Avenue, numéro, quartier, un repère connu…"
                  >
                    {(props) => (
                      <textarea
                        {...props}
                        rows={2}
                        autoComplete="street-address"
                        placeholder="Ex. Av. de la Paix n°12, près de l'église"
                        value={client.adresse}
                        onChange={(e) => changer("adresse")(e.target.value)}
                        className={clsx(
                          props.className,
                          "min-h-[5.5rem] resize-none py-3",
                        )}
                      />
                    )}
                  </Champ>
                </form>

                <div className="mt-5">
                  <ApercuWhatsApp message={message} />
                </div>

                <div ref={boutonPrincipal} className="mt-6">
                  <BoutonCommander lien={lien} onClick={commander} grand />
                  <AnimatePresence>
                    {Object.keys(erreurs).length > 0 && (
                      <motion.p
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-argile-fonce"
                      >
                        <CircleAlert className="size-4" aria-hidden="true" />
                        Complétez les champs en rouge pour commander.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-muet">
                    <Lock className="size-3.5" aria-hidden="true" />
                    Rien n&apos;est payé maintenant : vous réglez cash à la
                    livraison.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </Container>

      {/* Barre collante mobile */}
      <AnimatePresence>
        {!principalVisible && !succes && (
          <motion.div
            key="barre"
            initial={reduire ? { opacity: 0 } : { y: "110%" }}
            animate={reduire ? { opacity: 1 } : { y: 0 }}
            exit={reduire ? { opacity: 0 } : { y: "110%" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-trait bg-papier/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 shrink-0">
                <p className="text-xs text-muet">
                  Total · {articles} article{articles > 1 ? "s" : ""}
                </p>
                <p className="font-serif text-2xl leading-tight">
                  <MontantAnime valeur={total} />
                </p>
                <p className="text-[0.7rem] text-muet">+ livraison</p>
              </div>
              <div className="flex-1">
                <BoutonCommander lien={lien} onClick={commander} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {succes && (
          <ModaleSucces lien={lien} onFermer={fermer} onVider={toutVider} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Sous-composants ---------- */

function BoutonCommander({
  lien,
  onClick,
  grand,
}: {
  lien: string;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  grand?: boolean;
}) {
  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp (ouvre WhatsApp)"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5 font-medium text-encre transition-[background-color,transform] duration-300 hover:bg-whatsapp-fonce active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre",
        grand ? "min-h-15 text-[1.05rem]" : "min-h-13 text-[0.95rem]",
      )}
    >
      <WhatsAppIcon className={grand ? "size-6" : "size-5"} />
      <span className="whitespace-nowrap">
        Commander
        <span className={grand ? undefined : "hidden min-[420px]:inline"}> sur WhatsApp</span>
      </span>
    </a>
  );
}

function MontantAnime({ valeur }: { valeur: number }) {
  const reduire = useReducedMotion();
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valeur}
          initial={reduire ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduire ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {formatUSD(valeur)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Atout({
  icone,
  titre,
  texte,
}: {
  icone: ReactNode;
  titre: string;
  texte: string;
}) {
  return (
    <motion.li
      variants={{
        cache: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
      className="flex items-center gap-3 rounded-carte bg-lin p-3.5"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-carte text-encre-doux">
        {icone}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{titre}</span>
        <span className="block text-xs text-muet">{texte}</span>
      </span>
    </motion.li>
  );
}

type PropsControle = {
  id: string;
  name: string;
  className: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

function Champ({
  id,
  label,
  requis,
  erreur,
  aide,
  icone,
  select,
  children,
}: {
  id: string;
  label: string;
  requis?: boolean;
  erreur?: string;
  aide?: string;
  icone?: ReactNode;
  select?: boolean;
  children: (props: PropsControle) => ReactNode;
}) {
  const uid = useId();
  const idErreur = `${uid}-erreur`;
  const idAide = `${uid}-aide`;
  const decrit =
    [erreur ? idErreur : null, aide && !erreur ? idAide : null]
      .filter(Boolean)
      .join(" ") || undefined;
  const className = clsx(
    "block w-full rounded-2xl bg-papier text-base text-encre ring-1 ring-inset transition-[box-shadow,background-color] outline-none placeholder:text-muet",
    "focus:bg-carte focus:ring-2",
    icone ? "pl-11" : "pl-4",
    !select && "pr-4",
    "h-13",
    erreur
      ? "ring-argile focus:ring-argile-fonce"
      : "ring-trait-fort hover:ring-encre/35 focus:ring-encre",
  );

  return (
    <div data-invalide={erreur ? "true" : "false"}>
      <label
        htmlFor={`champ-${id}`}
        className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-encre"
      >
        {label}
        {requis ? (
          <span className="text-argile-fonce" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-xs font-normal text-muet">(facultatif)</span>
        )}
      </label>
      <div className="relative">
        {icone && (
          <span
            className={clsx(
              "pointer-events-none absolute top-[1.625rem] left-4 -translate-y-1/2",
              erreur ? "text-argile-fonce" : "text-muet",
            )}
          >
            {icone}
          </span>
        )}
        {children({
          id: `champ-${id}`,
          name: id,
          className,
          required: requis,
          "aria-invalid": erreur ? true : undefined,
          "aria-describedby": decrit,
        })}
        {select && (
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muet"
            aria-hidden="true"
          />
        )}
      </div>
      {aide && !erreur && (
        <p id={idAide} className="mt-1.5 text-xs text-muet">
          {aide}
        </p>
      )}
      <AnimatePresence initial={false}>
        {erreur && (
          <motion.p
            id={idErreur}
            key={erreur}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-argile-fonce"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {erreur}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
