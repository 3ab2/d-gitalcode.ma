import sharp from "sharp";
import { join } from "path";
import { mkdir } from "fs/promises";

const publicDir = join(process.cwd(), "public");
const iconsDir = join(publicDir, "icons");
const source = join(publicDir, "logo-mobile.png");
const brandDark = { r: 10, g: 15, b: 20, alpha: 1 };

async function createIcon(size, outputName, { maskable = false } = {}) {
  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandDark,
    },
  });

  const logoSize = maskable ? Math.round(size * 0.62) : Math.round(size * 0.78);
  const logo = await sharp(source)
    .resize(logoSize, logoSize, { fit: "contain", background: brandDark })
    .png()
    .toBuffer();

  await canvas
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toFile(join(iconsDir, outputName));
}

async function main() {
  await mkdir(iconsDir, { recursive: true });

  await createIcon(32, "favicon-32x32.png");
  await createIcon(180, "apple-touch-icon.png");
  await createIcon(192, "icon-192x192.png");
  await createIcon(512, "icon-512x512.png");
  await createIcon(192, "icon-192x192-maskable.png", { maskable: true });
  await createIcon(512, "icon-512x512-maskable.png", { maskable: true });

  await sharp(join(iconsDir, "favicon-32x32.png"))
    .resize(16, 16)
    .toFile(join(publicDir, "favicon.ico"));

  console.log("PWA icons generated in public/icons/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
