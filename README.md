# Jazzy World Business

Site vitrine et boutique en ligne de **Jazzy World Business**, à Kinshasa (RD Congo).

- Catalogue de produits avec photos, prix en dollars (USD) et fiches détaillées.
- Panier enregistré dans le navigateur du client (aucune base de données, aucun compte).
- Bouton **« Commander sur WhatsApp »** : la commande est envoyée sous forme de message pré-rempli au numéro de la boutique.
- Livraison partout à Kinshasa à partir de 8 000 FC (le prix exact dépend du trajet et est confirmé sur WhatsApp).
- Paiement cash à la livraison.
- Site 100 % statique (Next.js en export statique) : rapide, gratuit à héberger sur Vercel.

---

## 1. Lancer le site sur votre ordinateur

Pré-requis : [Node.js](https://nodejs.org) version 20 ou plus.

```bash
npm install      # une seule fois, installe les dépendances
npm run dev      # lance le site en mode développement
```

Ouvrez ensuite <http://localhost:3000> dans votre navigateur. Chaque modification de fichier s'affiche automatiquement.

Autres commandes utiles :

| Commande            | Rôle                                                       |
| ------------------- | ---------------------------------------------------------- |
| `npm run build`     | Construit la version finale du site dans le dossier `out/` |
| `npm run start`     | Affiche localement la version construite (`out/`)          |
| `npm run lint`      | Vérifie la qualité du code                                 |
| `npm run typecheck` | Vérifie les types TypeScript                               |
| `npm run photos`    | Optimise les photos des produits (voir plus bas)           |

---

## 2. Modifier les produits : `src/data/produits.json`

Tout le contenu de la boutique est dans **un seul fichier** : `src/data/produits.json`.

### Infos de la boutique (`boutique`)

Nom, slogan, numéro WhatsApp (format international **sans** `+` ni espaces, ex. `243960240705`), lien Facebook, prix minimum de livraison, mode de paiement.

### Catégories (`categories`)

```json
{ "id": "bien-etre", "nom": "Bien-être & forme" }
```

### Produits (`produits`)

Exemple de produit :

```json
{
  "id": "montre-arabe",
  "nom": "Montre arabe",
  "prix": 25,
  "categorie": "accessoires",
  "accroche": "Une phrase courte qui donne envie",
  "description": "Un paragraphe qui décrit le produit.",
  "pointsForts": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "images": ["/produits/montre-arabe/1.webp", "/produits/montre-arabe/2.webp"],
  "enStock": true,
  "vedette": true
}
```

| Champ         | Explication                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `id`          | Identifiant unique, en minuscules, sans accents ni espaces (des tirets). Il sert d'adresse : `/produits/montre-arabe/` |
| `nom`         | Nom affiché du produit                                                                           |
| `prix`        | Prix en dollars US, nombre sans le signe `$` (ex. `25` ou `12.5`)                                |
| `categorie`   | L'`id` d'une catégorie existante                                                                 |
| `accroche`    | Phrase courte affichée sous le nom                                                               |
| `description` | Texte complet de la fiche produit                                                                |
| `pointsForts` | Liste des avantages (3 à 5 conseillés)                                                           |
| `images`      | Chemins des photos ; la première est l'image principale                                          |
| `enStock`     | `true` si disponible, `false` pour afficher « Rupture de stock »                                 |
| `vedette`     | `true` pour mettre le produit en avant sur la page d'accueil                                     |

**Attention au format JSON** : guillemets droits `"`, une virgule entre chaque élément mais **pas** après le dernier. En cas de doute, collez le fichier sur <https://jsonlint.com> pour le vérifier.

- **Changer un prix** : modifiez `prix`.
- **Retirer un produit** : supprimez son bloc `{ … }` (ou passez `enStock` à `false` pour le garder visible).
- **Ajouter un produit** : copiez un bloc existant, changez l'`id` et le reste, puis ajoutez ses photos (étape suivante).

---

## 3. Ajouter ou changer les photos

Les photos sont automatiquement redimensionnées et converties en WebP léger (important pour les clients sur téléphone et connexion mobile).

1. Créez un dossier `photos-source/<id-du-produit>/` (même nom que l'`id` dans `produits.json`).
   Exemple : `photos-source/montre-arabe/`
2. Déposez-y les photos (JPG, PNG ou WebP). Elles sont classées par **ordre alphabétique** : nommez-les `1.jpg`, `2.jpg`, … pour choisir l'ordre. La première sera la photo principale.
3. Lancez :

   ```bash
   npm run photos
   ```

   Les photos optimisées sont créées dans `public/produits/<id>/1.webp`, `2.webp`, …
4. Dans `produits.json`, listez-les dans `images` :

   ```json
   "images": ["/produits/montre-arabe/1.webp", "/produits/montre-arabe/2.webp"]
   ```

Conseils : photos carrées ou verticales, bien éclairées, fond clair.

### Image de partage (Facebook / WhatsApp)

L'aperçu affiché quand on partage le lien du site est `src/app/opengraph-image.png`. Pour la régénérer (après un changement de logo par exemple) :

```bash
node scripts/og-image.mjs
```

---

## 4. Mettre le site en ligne sur Vercel (gratuit)

1. **Mettre le code sur GitHub** : créez un dépôt sur <https://github.com/new>, puis envoyez-y le projet :

   ```bash
   git remote add origin https://github.com/<votre-compte>/jazzy-world-business.git
   git push -u origin main
   ```

2. **Créer un compte Vercel** sur <https://vercel.com/signup> en choisissant « Continue with GitHub ».
3. Cliquez sur **« Add New… » → « Project »**, puis **« Import »** à côté du dépôt `jazzy-world-business`.
4. Vercel détecte automatiquement **Next.js**. Ne changez rien (aucune variable d'environnement n'est nécessaire) et cliquez sur **« Deploy »**.
5. Après une à deux minutes, le site est en ligne à une adresse du type `https://jazzy-world-business.vercel.app`.
6. **Mises à jour** : à chaque `git push` sur la branche `main` (nouveau produit, nouveau prix…), Vercel republie le site automatiquement.
7. **(Optionnel) Nom de domaine** : dans le projet Vercel, ouvrez **Settings → Domains** et ajoutez votre domaine (ex. `jazzyworld.cd`), puis suivez les instructions DNS.

### Important : l'adresse du site

L'adresse officielle du site est écrite dans la constante `SITE_URL` des fichiers :

- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/layout.tsx` (`metadataBase`)

Elle vaut par défaut `https://jazzy-world-business.vercel.app`. **Si Vercel vous attribue une autre adresse ou si vous ajoutez votre propre nom de domaine, remplacez-la dans ces fichiers**, sinon Google et les aperçus Facebook/WhatsApp pointeront vers la mauvaise adresse.

---

## Structure du projet

```
src/
  app/              Pages (accueil, boutique, fiches produits, panier, infos, 404)
  components/       Composants d'interface (en-tête, panier, cartes produits…)
    animations/     Animations liées au défilement (vitesse, texte révélé, progression)
  data/produits.json  Catalogue de la boutique
  lib/              Logique : catalogue, panier, message WhatsApp, formats de prix
public/
  brand/            Logo, globe, icônes
  produits/         Photos optimisées des produits
photos-source/      Photos originales (avant optimisation)
scripts/            Outils : optimisation des photos, image de partage
```

Technologies : Next.js (export statique), React, Tailwind CSS, Framer Motion, Zustand.

Style : noir et blanc façon boutique de mode (couleurs définies dans `src/app/globals.css`, polices Inter et Anton).
Les animations s'intensifient au fil du défilement et se coupent automatiquement si le téléphone
du visiteur a l'option « réduire les animations ».
