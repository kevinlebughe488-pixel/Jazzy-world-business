// Convertit les photos de photos-source/<slug>/ en WebP optimisés dans public/produits/<slug>/1.webp, 2.webp…
// Usage : npm run photos
import { readdir, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photos-source";
const OUT = "public/produits";
const EXT = /\.(jpe?g|png|webp)$/i;

// Les captures d'écran de téléphone (format très vertical) contiennent l'interface de l'appli
// sur fond noir : on garde la plus longue bande de lignes non noires, c'est-à-dire la photo du produit.
async function zoneProduit(fichier) {
  const { data, info } = await sharp(fichier).rotate().greyscale().raw().toBuffer({ resolveWithObject: true });
  if (info.height / info.width < 1.8) return null;
  let meilleur = { debut: 0, fin: 0 };
  let debut = -1;
  for (let y = 0; y <= info.height; y++) {
    let clairs = 0;
    if (y < info.height) for (let x = 0; x < info.width; x++) if (data[y * info.width + x] > 12) clairs++;
    const ligneClaire = y < info.height && clairs / info.width > 0.05;
    if (ligneClaire && debut < 0) debut = y;
    if (!ligneClaire && debut >= 0) {
      if (y - debut > meilleur.fin - meilleur.debut) meilleur = { debut, fin: y };
      debut = -1;
    }
  }
  const hauteur = meilleur.fin - meilleur.debut;
  return hauteur > info.width * 0.5 ? { left: 0, top: meilleur.debut, width: info.width, height: hauteur } : null;
}

const entries = await readdir(SRC, { withFileTypes: true });
for (const dir of entries.filter((e) => e.isDirectory())) {
  const files = (await readdir(path.join(SRC, dir.name))).filter((f) => EXT.test(f)).sort();
  const outDir = path.join(OUT, dir.name);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  for (const [i, file] of files.entries()) {
    const target = path.join(outDir, `${i + 1}.webp`);
    const source = path.join(SRC, dir.name, file);
    const zone = await zoneProduit(source);
    const image = sharp(source).rotate();
    if (zone) image.extract(zone);
    await image
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(target);
    console.log(`${dir.name}/${file} -> ${target}`);
  }
}
