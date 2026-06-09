import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CONTACT_EMAIL } from "../src/config/contact";
import {
  isResendConfigured,
  sendContactNotification,
} from "../src/lib/email";

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

loadEnvFile();

async function run() {
  const notifyTo =
    process.env.ADMIN_EMAIL_NOTIFY ||
    process.env.ADMIN_EMAIL ||
    CONTACT_EMAIL;

  console.log("=== Resend configuration ===");
  console.log("RESEND_API_KEY set:", Boolean(process.env.RESEND_API_KEY?.trim()));
  console.log("Resend configured:", isResendConfigured());
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM || "(default)");
  console.log("Notification target:", notifyTo);

  if (!isResendConfigured()) {
    console.error("\nFAIL: Set RESEND_API_KEY in .env (never commit it).");
    console.error("Get a key at https://resend.com/api-keys");
    process.exit(1);
  }

  if (notifyTo !== CONTACT_EMAIL) {
    console.error(`\nFAIL: Notifications must go to ${CONTACT_EMAIL}`);
    process.exit(1);
  }

  console.log("\n=== Sending test contact notification ===");
  const result = await sendContactNotification({
    name: "D-GITALCODE Test",
    email: "test@example.com",
    message: "Resend delivery test from scripts/test-resend.ts",
    type: "GENERAL",
  });

  console.log("Result:", JSON.stringify(result, null, 2));

  if (!result.success) {
    console.error("\nFAIL: Email was not sent.");
    process.exit(1);
  }

  console.log("\nOK: Test email sent. Check inbox:", notifyTo);
}

run().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
