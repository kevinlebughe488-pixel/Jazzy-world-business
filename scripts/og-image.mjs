// Génère l'image de partage (Open Graph) 1200x630 : src/app/opengraph-image.png
// Usage : node scripts/og-image.mjs
import sharp from "sharp";

const W = 1200;
const H = 630;
const GLOBE = 400;

const fond = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.55">
      <stop offset="0" stop-color="#7b3fb3"/>
      <stop offset="0.48" stop-color="#241a52"/>
      <stop offset="1" stop-color="#4fc3e8"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.24" cy="0.5" r="0.4">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <circle cx="1120" cy="70" r="180" fill="#ffffff" fill-opacity="0.06"/>
  <circle cx="1060" cy="600" r="120" fill="#ffffff" fill-opacity="0.05"/>
</svg>`;

const texte = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .titre { font-family: Outfit, 'DejaVu Sans', Arial, sans-serif; font-weight: 800; fill: #ffffff; }
    .sous { font-family: Inter, 'DejaVu Sans', Arial, sans-serif; font-weight: 500; fill: #ffffff; }
  </style>
  <text x="530" y="200" class="sous" font-size="26" letter-spacing="4" fill-opacity="0.8">BOUTIQUE EN LIGNE · KINSHASA</text>
  <text x="526" y="292" class="titre" font-size="78">Jazzy World</text>
  <text x="526" y="380" class="titre" font-size="78">Business</text>
  <rect x="530" y="418" width="96" height="6" rx="3" fill="#4fc3e8"/>
  <text x="530" y="490" class="sous" font-size="24">Livraison partout à Kinshasa · Paiement à la livraison</text>
</svg>`;

const globe = await sharp("public/brand/globe.webp").resize(GLOBE, GLOBE).png().toBuffer();

await sharp(Buffer.from(fond))
  .composite([
    { input: globe, left: 80, top: Math.round((H - GLOBE) / 2) },
    { input: Buffer.from(texte), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("src/app/opengraph-image.png");

console.log("src/app/opengraph-image.png généré (1200x630)");
