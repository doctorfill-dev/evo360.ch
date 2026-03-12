#!/usr/bin/env node
/**
 * optimize-images.mjs
 * Converts large JPG/PNG images to optimized WebP and resizes them
 * for web use (max 1600px wide, quality 80).
 */
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";

const IMG_DIR = "src/assets/img";
const MAX_WIDTH = 1600;
const QUALITY = 80;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function findImages(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.name === ".DS_Store") continue;
    if (entry.isDirectory()) {
      files.push(...(await findImages(fullPath)));
    } else if (EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, ext);
  const dir = dirname(filePath);
  const outPath = join(dir, `${name}.webp`);

  const info = await stat(filePath);
  const sizeMB = (info.size / 1024 / 1024).toFixed(2);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    await pipeline.webp({ quality: QUALITY }).toFile(outPath);

    const outInfo = await stat(outPath);
    const outSizeMB = (outInfo.size / 1024 / 1024).toFixed(2);
    const reduction = (((info.size - outInfo.size) / info.size) * 100).toFixed(0);

    console.log(
      `  ${filePath} (${sizeMB}MB) → ${outPath} (${outSizeMB}MB) [-${reduction}%]`
    );

    // Delete original after successful conversion
    await unlink(filePath);
    console.log(`  ✓ Deleted original ${filePath}`);

    return { original: filePath, output: outPath, saved: info.size - outInfo.size };
  } catch (err) {
    console.error(`  ✗ Failed: ${filePath} — ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("Scanning for images to optimize...\n");
  const images = await findImages(IMG_DIR);

  if (images.length === 0) {
    console.log("No JPG/PNG images found. All good!");
    return;
  }

  console.log(`Found ${images.length} image(s) to optimize:\n`);

  let totalSaved = 0;
  for (const img of images) {
    const result = await optimizeImage(img);
    if (result) totalSaved += result.saved;
  }

  console.log(
    `\nDone! Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`
  );
}

main();
