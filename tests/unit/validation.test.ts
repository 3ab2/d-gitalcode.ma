import assert from "node:assert/strict";
import test from "node:test";
import { analyticsEventSchema } from "../../src/lib/analytics/validation";
import {
  UploadValidationError,
  validateAdminImageFile,
} from "../../src/lib/admin/upload-validation";
import {
  contactSubmissionSchema,
  isFormExpired,
  isHoneypotTriggered,
  isSubmitTooFast,
  MAX_FORM_AGE_MS,
  MIN_SUBMIT_MS,
} from "../../src/lib/contact-validation";
import { sanitizeBlogHtml } from "../../src/lib/sanitize-html";

const lead = {
  name: "Test Person",
  email: "Person@Example.test",
  message: "I would like a website.",
};

test("a valid lead is accepted and normalized", () => {
  const out = contactSubmissionSchema.parse(lead);
  assert.equal(out.email, "person@example.test");
  assert.equal(out.locale, "fr");
});

test("invalid leads are rejected", () => {
  for (const bad of [
    { ...lead, email: "nope" },
    { ...lead, name: "x" },
    { ...lead, message: "short" },
    { ...lead, message: "x".repeat(5001) },
    { ...lead, locale: "de" },
    { ...lead, website: "http://spam.test" },
  ]) {
    assert.equal(contactSubmissionSchema.safeParse(bad).success, false, JSON.stringify(bad).slice(0, 80));
  }
});

test("spam signals", () => {
  assert.equal(isHoneypotTriggered("x"), true);
  assert.equal(isHoneypotTriggered("  "), false);
  assert.equal(isSubmitTooFast(Date.now() - MIN_SUBMIT_MS + 500), true);
  assert.equal(isSubmitTooFast(Date.now() - MIN_SUBMIT_MS - 500), false);
  assert.equal(isFormExpired(Date.now() - MAX_FORM_AGE_MS - 500), true);
});

test("analytics accepts the events the site sends", () => {
  for (const ok of [
    { event: "cta_whatsapp_click", page: "/en", metadata: { locale: "en", source: "float" } },
    { event: "pwa_prompt_shown" },
    { event: "blog_article_read", page: "/fr/blog/x", metadata: { slug: "x", locale: "fr", timestamp: "2026-11-25T00:00:00Z" } },
  ]) {
    assert.equal(analyticsEventSchema.safeParse(ok).success, true, ok.event);
  }
});

test("analytics rejects anything unbounded or structured", () => {
  for (const bad of [
    {},
    { event: 5 },
    { event: "Has Spaces" },
    { event: "x".repeat(65) },
    { event: "ok", page: "x".repeat(501) },
    { event: "ok", metadata: { nested: { a: 1 } } },
    { event: "ok", metadata: { list: [1] } },
    { event: "ok", metadata: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`k${i}`, "x".repeat(400)])) },
  ]) {
    assert.equal(analyticsEventSchema.safeParse(bad).success, false, JSON.stringify(bad).slice(0, 60));
  }
});

test("blog HTML is sanitized", () => {
  const out = sanitizeBlogHtml(
    '<p onclick="x()">Hi<script>alert(1)</script><a href="javascript:alert(1)">a</a><img src="data:text/html,x" onerror="x()"><a href="https://example.test" target="_blank">b</a></p>'
  );
  assert.doesNotMatch(out, /script|onclick|onerror|javascript:|data:/i);
  assert.match(out, /rel="noopener noreferrer"/);
});

test("image uploads check size, extension, and type together", () => {
  const file = (name: string, type: string, size = 10) => ({ name, type, size });
  assert.equal(validateAdminImageFile(file("a.PNG", "image/png")).mimeType, "image/png");
  for (const bad of [
    file("a.svg", "image/svg+xml"),
    file("a.png", "image/jpeg"),
    file("a.png", "text/html"),
    file("a", "image/png"),
    file("a.png", "image/png", 0),
    file("a.png", "image/png", 5 * 1024 * 1024),
  ]) {
    assert.throws(() => validateAdminImageFile(bad), UploadValidationError);
  }
});
