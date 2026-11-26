import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SOCIAL_LINKS, currentSocialUrl } from "../../src/config/social-links";
import { publicRepositoryUrl, verifiedStats } from "../../src/config/verified-facts";
import { leadRecipients } from "../../src/lib/lead-recipients";

test("statistics without evidence are hidden", () => {
  assert.deepEqual(verifiedStats([{ key: "projects", value: "50+" }, { key: "clients", value: "30+" }]), []);
});

test("only public repositories are linked", () => {
  for (const ok of [
    "https://github.com/dgitalcode/restaurant-template",
    "https://github.com/dgitalcode/Real-Estate-Template/",
    "https://github.com/dgitalcode/restaurant-template.git",
    "https://example.test/demo",
  ]) {
    assert.equal(publicRepositoryUrl(ok), ok);
  }
  for (const bad of [
    null,
    "",
    "not a url",
    "https://github.com/dgitalcode/extractorx",
    "https://github.com/dgitalcode/template-museum",
    "https://github.com/dgitalcode",
    "http://github.com/dgitalcode/restaurant-template",
    "javascript:alert(1)",
  ]) {
    assert.equal(publicRepositoryUrl(bad), null, String(bad));
  }
});

test("a retired profile address is replaced by the current one", () => {
  const current = DEFAULT_SOCIAL_LINKS.find((l) => l.platform === "linkedin")!.url;
  assert.equal(currentSocialUrl("linkedin", "https://www.linkedin.com/in/d-gitalcode-elkarch-abdelhamid-0604583bb/"), current);
  assert.equal(currentSocialUrl("linkedin", "https://www.linkedin.com/in/someone-else/"), "https://www.linkedin.com/in/someone-else/");
  assert.equal(currentSocialUrl("github", "https://github.com/dgitalcode"), "https://github.com/dgitalcode");
});

test("lead notifications try each address once, in order", () => {
  assert.deepEqual(leadRecipients("a@example.test", " A@example.test ", "b@example.test"), ["a@example.test", "b@example.test"]);
  assert.deepEqual(leadRecipients(null, "", "not-an-address", undefined, "c@example.test"), ["c@example.test"]);
  assert.deepEqual(leadRecipients(), []);
});
