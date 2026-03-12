#!/usr/bin/env node
/**
 * optimize-images.mjs
 * Generates responsive image variants (@400w, @800w) from existing WebP images.
 * Skips files that already exist. Does NOT delete originals.
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";

const IMG_DIR = "src/assets/img";
const QUALITY = 80;
const VARIANTS = [
  { suffix: "@400w", width: 400 },
  { suffix: "@800w", width: 800 },
];

async function findWebpImages(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.name === ".DS_Store") continue;
    if (entry.isDirectory()) {
      files.push(...(await findWebpImages(fullPath)));
    } else if (
      extname(entry.name).toLowerCase() === ".webp" &&
      !entry.name.includes("@")
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

async function generateVariants(filePath) {
  const ext = extname(filePath);
  const name = basename(filePath, ext);
  const dir = dirname(filePath);

  const metadata = await sharp(filePath).metadata();
  let generated = 0;
  let skipped = 0;

  for (const variant of VARIANTS) {
    const outPath = join(dir, `${name}${variant.suffix}.webp`);

    if (existsSync(outPath)) {
      console.log(`  SKIP  ${outPath} (already exists)`);
      skipped++;
      continue;
    }

    // Don't upscale: skip variant if source is narrower
    if (metadata.width && metadata.width <= variant.width) {
      console.log(`  SKIP  ${outPath} (source ${metadata.width}px < ${variant.width}px)`);
      skipped++;
      continue;
    }

    await sharp(filePath)
      .resize(variant.width, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const outInfo = await stat(outPath);
    const sizeKB = (outInfo.size / 1024).toFixed(0);
    console.log(`  OK    ${outPath} (${sizeKB} KB)`);
    generated++;
  }

  return { generated, skipped };
}

async function main() {
  console.log("Scanning for WebP images to generate responsive variants...\n");
  const images = await findWebpImages(IMG_DIR);

  if (images.length === 0) {
    console.log("No WebP source images found.");
    return;
  }

  console.log(`Found ${images.length} source image(s).\n`);

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const img of images) {
    console.log(`Processing: ${img}`);
    const result = await generateVariants(img);
    totalGenerated += result.generated;
    totalSkipped += result.skipped;
  }

  console.log(
    `\nDone! Generated: ${totalGenerated} variants, Skipped: ${totalSkipped}`
  );
}

main();
