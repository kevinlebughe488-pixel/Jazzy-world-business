// Génère l'image de partage (Open Graph) 1200x630 : src/app/opengraph-image.png
// Usage : node scripts/og-image.mjs
// Polices : Instrument Serif, Instrument Sans et Caveat si elles sont installées sur l'ordinateur
// (Google Fonts), sinon une police serif / sans-serif / manuscrite du système.
import sharp from "sharp";

const W = 1200;
const H = 630;

const PAPIER = "#f5f2eb";
const CARTE = "#fbfaf7";
const ENCRE = "#1d1c1a";
const ENCRE_DOUX = "#4a4740";
const OCRE_FONCE = "#7e5a1c";

const SERIF = "'Instrument Serif', Georgia, 'DejaVu Serif', serif";
const SANS = "'Instrument Sans', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const PLUME = "Caveat, 'Segoe Print', cursive";

/* ---------- Tirages photo (cadre clair, ruban, légende manuscrite) ---------- */

const PHOTO_L = 268;
const PHOTO_H = 335;
const MARGE = 14;
const BAS = 62;
const CADRE_L = PHOTO_L + MARGE * 2;
const CADRE_H = PHOTO_H + MARGE + BAS;

async function tirage({ photo, legende, ruban, angle }) {
  const image = await sharp(photo).resize(PHOTO_L, PHOTO_H, { fit: "cover" }).png().toBuffer();
  const cadre = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CADRE_L}" height="${CADRE_H + 20}">
  <rect x="0" y="20" width="${CADRE_L}" height="${CADRE_H}" rx="6" fill="${CARTE}"/>
  <text x="${MARGE + 4}" y="${20 + MARGE + PHOTO_H + 42}" font-family="${PLUME}" font-size="30" fill="${ENCRE_DOUX}">${legende}</text>
</svg>`;
  const carte = await sharp(Buffer.from(cadre))
    .composite([{ input: image, left: MARGE, top: 20 + MARGE }])
    .png()
    .toBuffer();
  // Ruban adhésif posé à cheval sur le cadre et la photo
  const rubanSeul = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CADRE_L}" height="${CADRE_H + 20}">
  <rect x="${CADRE_L / 2 - 46}" y="6" width="92" height="26" rx="2" fill="${ruban}" fill-opacity="0.85" transform="rotate(-3 ${CADRE_L / 2} 19)"/>
</svg>`;
  const complet = await sharp(carte).composite([{ input: Buffer.from(rubanSeul) }]).png().toBuffer();
  return sharp(complet).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function ombre(largeur, hauteur, angle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur + 80}" height="${hauteur + 80}">
  <rect x="40" y="56" width="${largeur}" height="${hauteur}" rx="8" fill="#463418" fill-opacity="0.22"/>
</svg>`;
  return sharp(Buffer.from(svg))
    .blur(18)
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

const tirages = [
  { photo: "public/produits/lunettes-chromees/1.webp", legende: "lunettes chromées", ruban: "#c8963e", angle: -5, x: 712, y: 150 },
  { photo: "public/produits/montre-arabe/1.webp", legende: "montre arabe", ruban: "#9ba68a", angle: 4, x: 892, y: 40 },
];

const calques = [];
for (const t of tirages) {
  calques.push({ input: await ombre(CADRE_L, CADRE_H, t.angle), left: t.x - 40, top: t.y - 20 });
  calques.push({ input: await tirage(t), left: t.x, top: t.y });
}

/* ---------- Texte et logo ---------- */

const LOGO_L = 210;
const LOGO_H = Math.round((LOGO_L * 308) / 640);
const logo = await sharp("public/brand/logo.webp").resize(LOGO_L, LOGO_H).png().toBuffer();

const texte = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="72" y="236" font-family="${SANS}" font-size="17" font-weight="600" letter-spacing="3.4" fill="${OCRE_FONCE}">BOUTIQUE EN LIGNE · KINSHASA</text>
  <text x="68" y="338" font-family="${SERIF}" font-size="100" fill="${ENCRE}">Le style, <tspan font-style="italic" fill="${ENCRE_DOUX}">livré</tspan></text>
  <text x="68" y="432" font-family="${SERIF}" font-size="100" fill="${ENCRE}">chez vous.</text>
  <text x="72" y="500" font-family="${SANS}" font-size="23" fill="${ENCRE_DOUX}">Commande sur WhatsApp, livraison partout à Kinshasa</text>
  <rect x="72" y="532" width="282" height="52" rx="26" fill="${ENCRE}"/>
  <text x="213" y="565" text-anchor="middle" font-family="${SANS}" font-size="21" font-weight="500" fill="${PAPIER}">Cash à la livraison</text>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 4, background: PAPIER } })
  .composite([...calques, { input: logo, left: 64, top: 52 }, { input: Buffer.from(texte), left: 0, top: 0 }])
  .flatten({ background: PAPIER })
  .png({ compressionLevel: 9 })
  .toFile("src/app/opengraph-image.png");

console.log("src/app/opengraph-image.png généré (1200x630)");
