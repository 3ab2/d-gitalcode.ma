/**
 * Verified releases shown on portfolio pages, keyed by portfolio slug.
 *
 * Add an entry only after the release exists: the tag is published, the tests ran on
 * `commit`, and every link opens. Unfinished projects have no entry. HQ keeps the same
 * record in operations/releases.json; tests/unit/releases.test.ts checks the format.
 */
export interface ProjectRelease {
  version: string;
  /** Full 40-character SHA of the released commit. */
  commit: string;
  /** ISO date, YYYY-MM-DD. */
  releasedOn: string;
  repositoryUrl: string;
  releaseNotesUrl: string;
  testEvidenceUrl: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export const PROJECT_RELEASES: Record<string, ProjectRelease> = {};

export function getProjectRelease(slug: string): ProjectRelease | null {
  return Object.hasOwn(PROJECT_RELEASES, slug) ? PROJECT_RELEASES[slug] : null;
}
