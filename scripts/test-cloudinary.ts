import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildOptimizedImageUrl,
  getImageResourceDetails,
  isCloudinaryConfigured,
  uploadImage,
} from "../src/lib/cloudinary";
import { getCloudinaryConfig } from "../src/config/cloudinary";

function loadEnvFile() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch {
    // .env is optional when vars are already exported
  }
}

const DEMO_IMAGE_URL =
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

async function run() {
  loadEnvFile();

  const { cloudName } = getCloudinaryConfig();

  console.log("=== Cloudinary configuration ===");
  console.log("Configured:", isCloudinaryConfigured());
  console.log("Cloud name:", cloudName || "(missing)");
  console.log("API key set:", Boolean(getCloudinaryConfig().apiKey));
  console.log("API secret set:", Boolean(getCloudinaryConfig().apiSecret));

  if (!isCloudinaryConfigured()) {
    console.error(
      "\nCloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
    process.exit(1);
  }

  console.log("\n=== Uploading demo image ===");
  const uploaded = await uploadImage(DEMO_IMAGE_URL, "dgitalcode/test");

  if (!uploaded) {
    console.error("Upload failed.");
    process.exit(1);
  }

  console.log("secure_url:", uploaded.secureUrl);
  console.log("public_id:", uploaded.publicId);
  console.log("optimized_url (f_auto,q_auto):", uploaded.optimizedUrl);

  console.log("\n=== Image metadata ===");
  const details = await getImageResourceDetails(uploaded.publicId);
  if (details) {
    console.log("width:", details.width);
    console.log("height:", details.height);
    console.log("format:", details.format);
    console.log("bytes:", details.bytes);
  } else {
    console.log("Could not fetch resource metadata.");
  }

  const rebuiltOptimized = buildOptimizedImageUrl(uploaded.publicId);
  console.log("\n=== Optimization check ===");
  console.log("Rebuilt optimized URL:", rebuiltOptimized);
  console.log(
    "\nDone! Open the optimized URL in your browser to verify format and size."
  );
}

run().catch((error) => {
  console.error("Test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
