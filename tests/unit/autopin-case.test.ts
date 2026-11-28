import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTOPIN_PRIVACY_URL,
  AUTOPIN_SCREENSHOTS,
  AUTOPIN_SLUG,
  getAutoPinCase,
} from "../../src/config/autopin-case";
import { locales } from "../../src/lib/i18n/settings";

test("every locale carries the same AutoPin claims", () => {
  const en = getAutoPinCase("en");
  for (const locale of locales) {
    const c = getAutoPinCase(locale);
    assert.equal(c.verified.length, en.verified.length, locale);
    assert.equal(c.partial.length, en.partial.length, locale);
    assert.equal(c.notClaimed.length, en.notClaimed.length, locale);
    assert.equal(c.architecture.length, en.architecture.length, locale);
    for (const shot of AUTOPIN_SCREENSHOTS) assert.ok(c.screens[shot.key], `${locale} ${shot.key}`);
    assert.ok(c.attribution.includes("D-GITALCODE"), locale);
  }
});

test("verified AutoPin features make no unverified claims", () => {
  const forbidden = /production|standard access|video|analytic|report/i;
  for (const item of getAutoPinCase("en").verified) {
    assert.doesNotMatch(item, forbidden, item);
  }
  assert.match(getAutoPinCase("en").statusText, /has not been granted/);
});

test("AutoPin page links are public https URLs", () => {
  assert.equal(AUTOPIN_SLUG, "autopin");
  assert.equal(new URL(AUTOPIN_PRIVACY_URL).protocol, "https:");
});
