import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sendReplyEmail } from "../src/lib/email";

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

const clientEmail = process.argv[2] || "client@example.com";

sendReplyEmail({
  to: clientEmail,
  subject: "D-GITALCODE — Admin reply test",
  message: "This is a test reply from the admin dashboard.",
  clientName: "Test Client",
}).then((result) => {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
});
