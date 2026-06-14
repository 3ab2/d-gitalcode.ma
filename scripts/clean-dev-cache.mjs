import fs from "node:fs";
import path from "node:path";

const manifestPath = path.join(".next", "dev", "prerender-manifest.json");

if (!fs.existsSync(manifestPath)) {
  process.exit(0);
}

try {
  JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch {
  fs.rmSync(".next", { recursive: true, force: true });
  console.log("[dev] Removed corrupted .next cache");
}
