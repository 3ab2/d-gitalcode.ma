import assert from "node:assert/strict";
import test from "node:test";
import { CONTACT_EMAIL } from "../../src/config/contact";
import { sendContactNotification } from "../../src/lib/email";

const lead = { name: "Test", email: "lead@example.test", message: "Hello there", type: "GENERAL" };

/** Run with a fake provider that refuses the given addresses. Returns the addresses tried. */
async function withProvider(refused: string[], run: () => Promise<void>): Promise<string[]> {
  const tried: string[] = [];
  const saved = { fetch: globalThis.fetch, key: process.env.RESEND_API_KEY, notify: process.env.ADMIN_EMAIL_NOTIFY, error: console.error };
  // Not a real key: it only has to look like one.
  process.env.RESEND_API_KEY = ["re", "unit", "test", "placeholder", "value"].join("_");
  process.env.ADMIN_EMAIL_NOTIFY = "notify@example.test";
  console.error = () => {};
  globalThis.fetch = (async (_url: unknown, init?: { body?: string }) => {
    const { to } = JSON.parse(init?.body ?? "{}");
    const address = Array.isArray(to) ? to[0] : to;
    tried.push(address);
    const ok = !refused.includes(address);
    return new Response(
      JSON.stringify(ok ? { id: "message-1" } : { statusCode: 403, name: "validation_error", message: "You can only send testing emails to your own email address" }),
      { status: ok ? 200 : 403, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = saved.fetch;
    console.error = saved.error;
    if (saved.key === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = saved.key;
    if (saved.notify === undefined) delete process.env.ADMIN_EMAIL_NOTIFY;
    else process.env.ADMIN_EMAIL_NOTIFY = saved.notify;
  }
  return tried;
}

test("the configured address is used alone when it works", async () => {
  const tried = await withProvider([], async () => {
    const out = await sendContactNotification(lead, { notifyEmail: "panel@example.test" });
    assert.deepEqual(out, { success: true, id: "message-1" });
  });
  assert.deepEqual(tried, ["panel@example.test"]);
});

test("a refused address falls back to the next one, ending with the account owner", async () => {
  const tried = await withProvider(["panel@example.test", "notify@example.test"], async () => {
    const out = await sendContactNotification(lead, { notifyEmail: "panel@example.test" });
    assert.equal(out.success, true);
  });
  assert.deepEqual(tried, ["panel@example.test", "notify@example.test", CONTACT_EMAIL]);
});

test("a failure everywhere is reported as a failure", async () => {
  await withProvider(["panel@example.test", "notify@example.test", CONTACT_EMAIL], async () => {
    const out = await sendContactNotification(lead, { notifyEmail: "panel@example.test" });
    assert.equal(out.success, false);
    assert.equal(out.success === false && out.reason, "send_failed");
  });
});

test("without a key nothing is sent", async () => {
  const saved = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const warn = console.warn;
  console.warn = () => {};
  const out = await sendContactNotification(lead);
  console.warn = warn;
  if (saved !== undefined) process.env.RESEND_API_KEY = saved;
  assert.deepEqual(out, { success: false, reason: "not_configured" });
});
