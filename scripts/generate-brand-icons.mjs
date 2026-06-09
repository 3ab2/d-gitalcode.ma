import sharp from "sharp";
import toIco from "to-ico";
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { dirname, join } from "path";

const root = process.cwd();
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");
const appDir = join(root, "src", "app");
const assetsDir = join(root, "assets", "brand");

const userSource =
  "C:\\Users\\THINKPAD PC\\Downloads\\D-GITALCODE short Logo 2000x2000 (500 x 500 px).png";
const repoSource = join(assetsDir, "d-gitalcode-short-logo.png");
const fallbackSource = join(publicDir, "logo-mobile.png");
const brandDark = { r: 10, g: 15, b: 20, alpha: 1 };

async function resolveSource() {
  if (existsSync(userSource)) {
    await mkdir(assetsDir, { recursive: true });
    await copyFile(userSource, repoSource);
    return userSource;
  }

  if (existsSync(repoSource)) {
    return repoSource;
  }

  await mkdir(assetsDir, { recursive: true });
  await copyFile(fallbackSource, repoSource);
  return repoSource;
}

async function resizePng(source, size, outputPath) {
  await sharp(source)
    .resize(size, size, { fit: "contain", background: brandDark })
    .png()
    .toFile(outputPath);
}

async function createMaskable(source, size, outputPath) {
  const logoSize = Math.round(size * 0.62);
  const logo = await sharp(source)
    .resize(logoSize, logoSize, { fit: "contain", background: brandDark })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandDark,
    },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toFile(outputPath);
}

async function writeFaviconIco(source) {
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map((size) =>
      sharp(source)
        .resize(size, size, { fit: "contain", background: brandDark })
        .png()
        .toBuffer()
    )
  );
  const ico = await toIco(images);

  await writeFile(join(publicDir, "favicon.ico"), ico);
  await writeFile(join(appDir, "favicon.ico"), ico);
}

async function main() {
  const source = await resolveSource();
  await mkdir(iconsDir, { recursive: true });

  await resizePng(source, 16, join(iconsDir, "favicon-16x16.png"));
  await resizePng(source, 32, join(iconsDir, "favicon-32x32.png"));
  await resizePng(source, 180, join(iconsDir, "apple-touch-icon.png"));
  await resizePng(source, 192, join(iconsDir, "android-chrome-192x192.png"));
  await resizePng(source, 512, join(iconsDir, "android-chrome-512x512.png"));
  await createMaskable(
    source,
    192,
    join(iconsDir, "android-chrome-192x192-maskable.png")
  );
  await createMaskable(
    source,
    512,
    join(iconsDir, "android-chrome-512x512-maskable.png")
  );

  await writeFaviconIco(source);

  await resizePng(source, 32, join(appDir, "icon.png"));
  await resizePng(source, 180, join(appDir, "apple-icon.png"));

  console.log(`Brand icons generated from: ${source}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
