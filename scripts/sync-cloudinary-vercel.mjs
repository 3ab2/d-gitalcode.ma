/**
 * Sync CLOUDINARY_* from .env to Vercel Production.
 * Usage: node scripts/sync-cloudinary-vercel.mjs
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

function parseEnvFile(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
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
    vars[key] = value;
  }
  return vars;
}

const envPath = resolve(process.cwd(), ".env");
const env = parseEnvFile(envPath);
const keys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const key of keys) {
  const value = env[key]?.trim();
  if (!value) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }

  const quoted = JSON.stringify(value);
  const updateCmd = `npx vercel env update ${key} production --value ${quoted} --yes`;
  const addCmd = `npx vercel env add ${key} production --value ${quoted} --yes --force`;

  try {
    execSync(updateCmd, { stdio: ["pipe", "pipe", "pipe"] });
  } catch {
    execSync(addCmd, { stdio: ["pipe", "pipe", "pipe"] });
  }

  console.log(`Synced ${key} to Vercel Production (length=${value.length})`);
}

console.log("Done. New serverless invocations will use updated credentials.");
