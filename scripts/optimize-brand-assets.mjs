import sharp from "sharp";
import { join } from "path";

const publicDir = join(process.cwd(), "public");

async function removeDarkBackground(inputPath, outputPath, threshold = 42) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    if (max < threshold) {
      pixels[i + 3] = 0;
      continue;
    }

    if (max - min < 18 && max < threshold + 35) {
      const alpha = Math.round(((max - threshold) / 35) * 255);
      pixels[i + 3] = Math.min(pixels[i + 3], Math.max(0, alpha));
    }
  }

  await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(outputPath);
}

async function optimizeLogo(inputPath, outputPath, width) {
  await sharp(inputPath)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  await removeDarkBackground(
    join(publicDir, "hero.png"),
    join(publicDir, "hero.webp"),
    42
  );

  await optimizeLogo(
    join(publicDir, "logo-desktop.png"),
    join(publicDir, "logo-desktop.webp"),
    480
  );

  await optimizeLogo(
    join(publicDir, "logo-mobile.png"),
    join(publicDir, "logo-mobile.webp"),
    320
  );

  console.log("Brand assets optimized.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
