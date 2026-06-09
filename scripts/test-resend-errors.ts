import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sendContactNotification } from "../src/lib/email";

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
    // ignore
  }
}

loadEnvFile();

async function run() {
  console.log("=== Test 1: missing API key ===");
  const savedKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const missing = await sendContactNotification({
    name: "Test",
    email: "test@example.com",
    message: "missing key test",
    type: "GENERAL",
  });
  console.log(missing);
  process.env.RESEND_API_KEY = savedKey;

  console.log("\n=== Test 2: invalid API key ===");
  process.env.RESEND_API_KEY = "re_invalid_key_for_error_handling_test";
  const invalid = await sendContactNotification({
    name: "Test",
    email: "test@example.com",
    message: "invalid key test",
    type: "GENERAL",
  });
  console.log(invalid);
  process.env.RESEND_API_KEY = savedKey;

  const ok =
    missing.success === false &&
    missing.reason === "not_configured" &&
    invalid.success === false &&
    invalid.reason === "send_failed";

  if (!ok) {
    console.error("\nFAIL: error handling checks did not pass");
    process.exit(1);
  }

  console.log("\nOK: error handling verified");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
