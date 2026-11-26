import assert from "node:assert/strict";
import test from "node:test";
import {
  getProjectRelease,
  PROJECT_RELEASES,
  type ProjectRelease,
} from "../../src/config/releases";
import { DEFAULT_SOCIAL_LINKS, SOCIAL_PLATFORMS } from "../../src/config/social-links";

function problems(r: ProjectRelease): string[] {
  const bad: string[] = [];
  if (!/^[0-9a-f]{40}$/.test(r.commit)) bad.push("commit must be a full SHA");
  if (!/^v?\d+\.\d+\.\d+/.test(r.version)) bad.push("version must be semantic");
  const day = new Date(`${r.releasedOn}T00:00:00Z`);
  if (Number.isNaN(day.getTime()) || day.getTime() > Date.now()) bad.push("releasedOn must be a past date");
  for (const [field, host] of [
    ["repositoryUrl", "github.com"],
    ["releaseNotesUrl", null],
    ["testEvidenceUrl", null],
    ["youtubeUrl", "www.youtube.com"],
    ["linkedinUrl", "www.linkedin.com"],
  ] as const) {
    const value = r[field];
    if (value === undefined) {
      if (field === "youtubeUrl" || field === "linkedinUrl") continue;
      bad.push(`${field} is required`);
      continue;
    }
    const url = new URL(value);
    if (url.protocol !== "https:" || (host && url.host !== host)) bad.push(`${field}: ${value}`);
  }
  return bad;
}

const good: ProjectRelease = {
  version: "v1.2.3",
  commit: "a".repeat(40),
  releasedOn: "2026-01-02",
  repositoryUrl: "https://github.com/dgitalcode/example",
  releaseNotesUrl: "https://github.com/dgitalcode/example/releases/tag/v1.2.3",
  testEvidenceUrl: "https://github.com/dgitalcode/example/actions/runs/1",
};

test("published releases are complete and well formed", () => {
  for (const [slug, release] of Object.entries(PROJECT_RELEASES)) {
    assert.deepEqual(problems(release), [], slug);
  }
});

test("the format check notices bad records", () => {
  assert.deepEqual(problems(good), []);
  assert.equal(problems({ ...good, commit: "abc1234" }).length, 1);
  assert.equal(problems({ ...good, releasedOn: "2999-01-01" }).length, 1);
  assert.equal(problems({ ...good, youtubeUrl: "http://evil.test/" }).length, 1);
});

test("an unreleased project has no release facts", () => {
  assert.equal(getProjectRelease("not-a-project"), null);
  assert.equal(getProjectRelease("toString"), null);
});

test("social links are https and cover each platform once", () => {
  assert.deepEqual(DEFAULT_SOCIAL_LINKS.map((l) => l.platform).sort(), [...SOCIAL_PLATFORMS].sort());
  for (const link of DEFAULT_SOCIAL_LINKS) assert.equal(new URL(link.url).protocol, "https:");
});
