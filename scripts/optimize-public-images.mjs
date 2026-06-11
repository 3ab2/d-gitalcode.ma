import sharp from "sharp";
import { join } from "path";

const publicDir = join(process.cwd(), "public");

async function optimizeHeroPng() {
  const input = join(publicDir, "hero.png");
  const output = join(publicDir, "hero.png");
  const tmp = join(publicDir, ".hero.optimize.tmp.png");

  await sharp(input)
    .resize({ width: 1200, withoutEnlargement: true })
    .png({ quality: 82, compressionLevel: 9, palette: true })
    .toFile(tmp);

  await sharp(tmp).toFile(output);
  const { unlink } = await import("fs/promises");
  await unlink(tmp);
  console.log("hero.png optimized");
}

async function createBlogDefaultWebp() {
  const input = join(publicDir, "images", "blog-default.jpg");
  const output = join(publicDir, "images", "blog-default.webp");

  await sharp(input)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  console.log("blog-default.webp created");
}

await optimizeHeroPng();
await createBlogDefaultWebp();
