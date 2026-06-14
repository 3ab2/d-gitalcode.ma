/**
 * End-to-end production upload test (admin auth + Cloudinary).
 * Usage: node scripts/test-production-upload.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const baseUrl = (process.argv[2] ?? "https://d-gitalcodema.vercel.app").replace(
  /\/$/,
  ""
);

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

function extractCookies(setCookieHeaders) {
  const jar = new Map();
  for (const header of setCookieHeaders) {
    const part = header.split(";")[0];
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    jar.set(part.slice(0, eq), part.slice(eq + 1));
  }
  return jar;
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function main() {
  const env = parseEnvFile(resolve(process.cwd(), ".env"));
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD required in .env");
    process.exit(1);
  }

  const jar = new Map();

  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfData = await csrfRes.json();
  for (const [k, v] of extractCookies(
    csrfRes.headers.getSetCookie?.() ?? []
  )) {
    jar.set(k, v);
  }

  const signInBody = new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    email,
    password,
    callbackUrl: `${baseUrl}/admin`,
    json: "true",
  });

  const signInRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(jar),
    },
    body: signInBody,
    redirect: "manual",
  });

  for (const [k, v] of extractCookies(
    signInRes.headers.getSetCookie?.() ?? []
  )) {
    jar.set(k, v);
  }

  if (signInRes.status !== 302 && signInRes.status !== 200) {
    console.error("Sign-in failed:", signInRes.status, await signInRes.text());
    process.exit(1);
  }

  const healthRes = await fetch(`${baseUrl}/api/admin/health/cloudinary`, {
    headers: { Cookie: cookieHeader(jar) },
  });
  const healthData = await healthRes.json();
  console.log("Health status:", healthRes.status);
  console.log("Health response:", JSON.stringify(healthData, null, 2));

  if (!healthRes.ok || !healthData.ok) {
    process.exit(1);
  }

  const pngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const buffer = Buffer.from(pngBase64, "base64");
  const form = new FormData();
  form.append(
    "file",
    new Blob([buffer], { type: "image/png" }),
    "production-upload-test.png"
  );
  form.append("folder", "dgitalcode/test");

  const uploadRes = await fetch(`${baseUrl}/api/admin/upload`, {
    method: "POST",
    headers: { Cookie: cookieHeader(jar) },
    body: form,
  });

  const uploadData = await uploadRes.json();
  console.log("Upload status:", uploadRes.status);
  console.log("Upload response:", JSON.stringify(uploadData, null, 2));

  if (!uploadRes.ok || !uploadData.success) {
    process.exit(1);
  }

  console.log("\nProduction upload OK:", uploadData.url);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
