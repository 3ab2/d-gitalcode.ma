import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { serializeJsonLd } from "../../src/lib/seo/json-ld";
import {
  buildPageAlternates,
  buildPublicPageMetadata,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_SIZE,
  FALLBACK_SITE_URL,
  getSiteUrl,
  localeToOgLocale,
} from "../../src/lib/seo/metadata";

test("the site URL falls back to an address that exists and has no trailing slash", () => {
  const saved = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal(getSiteUrl(), FALLBACK_SITE_URL);
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test/";
  assert.equal(getSiteUrl(), "https://example.test");
  if (saved === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = saved;
});

test("canonical and hreflang cover every locale and x-default", () => {
  const a = buildPageAlternates("contact", "ar");
  assert.ok(a.canonical.endsWith("/ar/contact"));
  assert.deepEqual(Object.keys(a.languages).sort(), ["ar", "en", "fr", "x-default"]);
  assert.ok(a.languages["x-default"].endsWith("/fr/contact"));
});

test("a title that already has the brand does not get it twice", () => {
  const home = buildPublicPageMetadata({ locale: "en", title: "D-GITALCODE — Premium Digital Agency" });
  assert.deepEqual(home.title, { absolute: "D-GITALCODE — Premium Digital Agency" });
  const page = buildPublicPageMetadata({ locale: "en", path: "contact", title: "Contact" });
  assert.equal(page.title, "Contact");
});

test("Open Graph locales use language_TERRITORY", () => {
  assert.equal(localeToOgLocale("fr"), "fr_FR");
  assert.equal(localeToOgLocale("en"), "en_US");
  assert.equal(localeToOgLocale("ar"), "ar_MA");
});

test("the default share image exists and has the declared size", () => {
  const png = fs.readFileSync(`public${DEFAULT_OG_IMAGE}`);
  assert.equal(png.readUInt32BE(16), DEFAULT_OG_SIZE.width);
  assert.equal(png.readUInt32BE(20), DEFAULT_OG_SIZE.height);
});

test("JSON-LD cannot close its own script element", () => {
  const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!out.includes("<"));
  assert.equal(JSON.parse(out).name, "</script><script>alert(1)</script>");
});
