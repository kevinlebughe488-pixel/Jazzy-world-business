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

const ease = [0.22, 1, 0.36, 1] as const;
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

  useEffect(() => enregistrerClient(client), [client]);

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

  const changer = (champ: keyof Client) => (valeur: string) =>
    setClient((c) => ({ ...c, [champ]: valeur }));

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
      <Container className="pt-24 pb-40 lg:pt-32 lg:pb-24">
        {/* En-tête */}
        <motion.div
          initial={reduire ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <Link
            href="/boutique/"
            className="group -ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-nuit/65 transition-colors hover:text-violet focus-visible:outline-2 focus-visible:outline-violet"
          >
            <ArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Continuer mes achats
          </Link>
          <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Mon <span className="texte-degrade">panier</span>
            </h1>
            <span className="mb-1.5 inline-flex items-center rounded-full bg-violet/10 px-3 py-1 text-sm font-semibold text-violet">
              {articles} article{articles > 1 ? "s" : ""}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-nuit/65">
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
            initial={
              reduire
                ? { opacity: 0 }
                : { opacity: 0, y: 32, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-nuit/[0.06] ring-1 ring-nuit/5">
              <div aria-hidden="true" className="degrade-marque h-1.5 w-full" />
              <div className="p-5 sm:p-7">
                <h2 id="titre-recap" className="text-xl font-bold">
                  Récapitulatif
                </h2>

                <dl className="mt-5 space-y-3.5 text-[0.95rem]">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-nuit/65">
                      Sous-total ({articles} article{articles > 1 ? "s" : ""})
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      <MontantAnime valeur={total} />
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 text-nuit/65">
                      <Truck
                        className="size-4 shrink-0 text-violet"
                        aria-hidden="true"
                      />
                      Livraison
                    </dt>
                    <dd className="max-w-[60%] text-right">
                      <span className="font-semibold">
                        à partir de {formatFC(boutique.livraison.prixMinFC)}
                      </span>
                      <span className="block text-xs text-nuit/55">
                        (selon le trajet, confirmé sur WhatsApp)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-nuit/65">
                      <Banknote
                        className="size-4 shrink-0 text-violet"
                        aria-hidden="true"
                      />
                      Paiement
                    </dt>
                    <dd className="font-semibold">{boutique.paiement}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-dashed border-nuit/15 pt-5">
                  <div>
                    <p className="text-sm font-medium text-nuit/65">
                      Total articles
                    </p>
                    <p className="text-xs text-nuit/50">+ frais de livraison</p>
                  </div>
                  <p className="font-display text-3xl font-bold tabular-nums">
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
                    <h3 id="titre-form" className="text-lg font-bold">
                      Vos informations de livraison
                    </h3>
                    <p className="mt-0.5 text-sm text-nuit/55">
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
                          !client.commune && "text-nuit/45",
                        )}
                      >
                        <option value="" disabled>
                          Choisir votre commune
                        </option>
                        {COMMUNES.map((c) => (
                          <option key={c} value={c} className="text-nuit">
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
                        className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-red-600"
                      >
                        <CircleAlert className="size-4" aria-hidden="true" />
                        Complétez les champs en rouge pour commander.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-nuit/55">
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
            className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/90 backdrop-blur-xl border-nuit/10 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgba(36,26,82,0.25)] lg:hidden"
          >
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 shrink-0">
                <p className="text-xs font-medium text-nuit/60">
                  Total · {articles} article{articles > 1 ? "s" : ""}
                </p>
                <p className="font-display text-xl leading-tight font-bold tabular-nums">
                  <MontantAnime valeur={total} />
                </p>
                <p className="text-[0.65rem] text-nuit/50">+ livraison</p>
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
  const reduire = useReducedMotion();
  return (
    <motion.a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp (ouvre WhatsApp)"
      onClick={onClick}
      whileHover={reduire ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-whatsapp px-5 font-semibold text-white shadow-lg shadow-whatsapp/35 transition-shadow hover:shadow-xl hover:shadow-whatsapp/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
        grand ? "min-h-16 text-lg" : "min-h-14 text-base",
      )}
    >
      {!reduire && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          initial={{ x: "-150%" }}
          animate={{ x: "450%" }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 3.2,
            ease: "easeInOut",
          }}
        />
      )}
      <WhatsAppIcon className={grand ? "size-6" : "size-5"} />
      <span className="relative whitespace-nowrap">
        Commander
        <span className={grand ? undefined : "hidden min-[420px]:inline"}> sur WhatsApp</span>
      </span>
    </motion.a>
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
      className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 ring-1 ring-nuit/5"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet">
        {icone}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{titre}</span>
        <span className="block text-xs text-nuit/55">{texte}</span>
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
    "block w-full rounded-2xl bg-creme text-base text-nuit ring-1 transition-[box-shadow,background-color] outline-none placeholder:text-nuit/40",
    "focus:bg-white focus:ring-2",
    icone ? "pl-11" : "pl-4",
    !select && "pr-4",
    "h-13",
    erreur
      ? "ring-red-500/70 focus:ring-red-500"
      : "ring-nuit/10 hover:ring-nuit/20 focus:ring-violet",
  );

  return (
    <div data-invalide={erreur ? "true" : "false"}>
      <label
        htmlFor={`champ-${id}`}
        className="mb-1.5 flex items-baseline gap-1 text-sm font-semibold text-nuit"
      >
        {label}
        {requis ? (
          <span className="text-violet" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-xs font-normal text-nuit/45">(facultatif)</span>
        )}
      </label>
      <div className="relative">
        {icone && (
          <span
            className={clsx(
              "pointer-events-none absolute top-[1.625rem] left-4 -translate-y-1/2",
              erreur ? "text-red-500" : "text-nuit/40",
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
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-nuit/45"
            aria-hidden="true"
          />
        )}
      </div>
      {aide && !erreur && (
        <p id={idAide} className="mt-1.5 text-xs text-nuit/50">
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
            className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-600"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {erreur}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
