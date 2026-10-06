import type { InfosClient } from "@/lib/whatsapp";

export const COMMUNES = [
  "Bandalungwa",
  "Barumbu",
  "Bumbu",
  "Gombe",
  "Kalamu",
  "Kasa-Vubu",
  "Kimbanseke",
  "Kinshasa",
  "Kintambo",
  "Kisenso",
  "Lemba",
  "Limete",
  "Lingwala",
  "Makala",
  "Maluku",
  "Masina",
  "Matete",
  "Mont-Ngafula",
  "Ndjili",
  "Ngaba",
  "Ngaliema",
  "Ngiri-Ngiri",
  "Nsele",
  "Selembao",
] as const;

export type Client = Required<InfosClient>;
export type ChampRequis = "nom" | "telephone" | "commune";
export type Erreurs = Partial<Record<ChampRequis, string>>;

export const CLE_CLIENT = "jazzy-client";
export const CLIENT_VIDE: Client = {
  nom: "",
  telephone: "",
  commune: "",
  adresse: "",
};

export function lireClient(): Client {
  try {
    const brut = window.localStorage.getItem(CLE_CLIENT);
    if (!brut) return CLIENT_VIDE;
    const v = JSON.parse(brut) as Partial<Client>;
    const s = (x: unknown) => (typeof x === "string" ? x : "");
    const commune = s(v.commune);
    return {
      nom: s(v.nom),
      telephone: s(v.telephone),
      commune: (COMMUNES as readonly string[]).includes(commune) ? commune : "",
      adresse: s(v.adresse),
    };
  } catch {
    return CLIENT_VIDE;
  }
}

export function enregistrerClient(client: Client) {
  try {
    window.localStorage.setItem(CLE_CLIENT, JSON.stringify(client));
  } catch {
    /* stockage indisponible (navigation privée) : on ignore */
  }
}

export function valider(client: Client): Erreurs {
  const erreurs: Erreurs = {};
  if (client.nom.trim().length < 2)
    erreurs.nom = "Indiquez votre nom pour la livraison.";
  const chiffres = client.telephone.replace(/\D/g, "");
  if (!chiffres) erreurs.telephone = "Indiquez un numéro pour vous joindre.";
  else if (chiffres.length < 9 || chiffres.length > 15)
    erreurs.telephone = "Ce numéro semble incomplet (ex. 0812 345 678).";
  if (!client.commune) erreurs.commune = "Choisissez votre commune.";
  return erreurs;
}
