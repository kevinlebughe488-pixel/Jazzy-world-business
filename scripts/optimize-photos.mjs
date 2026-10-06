// Convertit les photos de photos-source/<slug>/ en WebP optimisés dans public/produits/<slug>/1.webp, 2.webp…
// Usage : npm run photos
import { readdir, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photos-source";
const OUT = "public/produits";
const EXT = /\.(jpe?g|png|webp)$/i;

const entries = await readdir(SRC, { withFileTypes: true });
for (const dir of entries.filter((e) => e.isDirectory())) {
  const files = (await readdir(path.join(SRC, dir.name))).filter((f) => EXT.test(f)).sort();
  const outDir = path.join(OUT, dir.name);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  for (const [i, file] of files.entries()) {
    const target = path.join(outDir, `${i + 1}.webp`);
    await sharp(path.join(SRC, dir.name, file))
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(target);
    console.log(`${dir.name}/${file} -> ${target}`);
  }
}
