// Génère l'image de partage (Open Graph) 1200x630 : src/app/opengraph-image.png
// Usage : node scripts/og-image.mjs
import sharp from "sharp";

const W = 1200;
const H = 630;

// Trois photos produits en colonne de droite (style vitrine noir et blanc)
const PHOTOS = [
  "public/produits/montre-arabe/1.webp",
  "public/produits/sac-de-voyage/1.webp",
  "public/produits/lunettes-chromees/1.webp",
];
const TAILLE = 250;

const fond = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#000000"/>
  <rect x="0" y="0" width="${W}" height="44" fill="#ffffff"/>
</svg>`;

const texte = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .titre { font-family: 'DejaVu Sans Condensed', 'DejaVu Sans', Arial, sans-serif; font-weight: 800; fill: #ffffff; }
    .sous { font-family: 'DejaVu Sans', Arial, sans-serif; font-weight: 700; fill: #ffffff; }
    .bandeau { font-family: 'DejaVu Sans', Arial, sans-serif; font-weight: 700; fill: #000000; }
  </style>
  <text x="60" y="29" class="bandeau" font-size="17" letter-spacing="4">LIVRAISON PARTOUT À KINSHASA · PAIEMENT CASH À LA LIVRAISON</text>
  <text x="60" y="150" class="sous" font-size="20" letter-spacing="6" fill-opacity="0.6">BOUTIQUE EN LIGNE · KINSHASA</text>
  <text x="54" y="285" class="titre" font-size="128" letter-spacing="-2">JAZZY</text>
  <text x="54" y="410" class="titre" font-size="128" letter-spacing="-2">WORLD</text>
  <text x="62" y="455" class="sous" font-size="22" letter-spacing="14">BUSINESS</text>
  <rect x="62" y="500" width="120" height="3" fill="#ffffff"/>
  <text x="62" y="550" class="sous" font-size="22" fill-opacity="0.85">Commandez sur WhatsApp · Livraison dès 8 000 FC</text>
</svg>`;

const photos = await Promise.all(
  PHOTOS.map((p) => sharp(p).resize(TAILLE, TAILLE, { fit: "cover" }).png().toBuffer()),
);

await sharp(Buffer.from(fond))
  .composite([
    { input: photos[0], left: 690, top: 80 },
    { input: photos[1], left: 690 + TAILLE + 10, top: 80 },
    { input: photos[2], left: 690 + (TAILLE + 10) / 2, top: 80 + TAILLE + 10 },
    { input: Buffer.from(texte), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("src/app/opengraph-image.png");

console.log("src/app/opengraph-image.png généré (1200x630)");
