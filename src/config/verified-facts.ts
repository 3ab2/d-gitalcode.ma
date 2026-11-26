/**
 * Facts that may be shown as claims. Anything stored in the database but not listed
 * here stays hidden until somebody can point to the evidence for it.
 */

/** SiteStat keys whose value has been checked. Add a key together with its evidence. */
export const VERIFIED_STAT_KEYS: readonly string[] = [];

export function verifiedStats<T extends { key: string }>(stats: T[]): T[] {
  return stats.filter((stat) => VERIFIED_STAT_KEYS.includes(stat.key));
}

/** Repositories checked to be public (2026-11-25). Links to private ones end in a 404. */
const PUBLIC_REPOSITORIES = new Set([
  "dgitalcode/restaurant-template",
  "dgitalcode/real-estate-template",
]);

/** The link if visitors can open it, otherwise null. Links outside GitHub pass through. */
export function publicRepositoryUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  if (parsed.hostname !== "github.com") return url;
  const repository = parsed.pathname
    .split("/")
    .filter(Boolean)
    .slice(0, 2)
    .join("/")
    .toLowerCase()
    .replace(/\.git$/, "");
  return PUBLIC_REPOSITORIES.has(repository) ? url : null;
}
