import type { TFunction } from "i18next";
import type { ProjectRelease } from "@/config/releases";
import { type Locale } from "@/lib/i18n/settings";

const linkClass =
  "text-brand-green underline underline-offset-4 hover:text-white";

/** Facts about one verified release: what was shipped, from which commit, with which proof. */
export function ReleaseFacts({
  release,
  locale,
  t,
}: {
  release: ProjectRelease;
  locale: Locale;
  t: TFunction;
}) {
  const date = new Date(`${release.releasedOn}T00:00:00Z`).toLocaleDateString(
    locale,
    { dateStyle: "long", timeZone: "UTC" }
  );
  const links: [string, string | undefined][] = [
    [t("release.notes"), release.releaseNotesUrl],
    [t("release.tests"), release.testEvidenceUrl],
    [t("release.video"), release.youtubeUrl],
    [t("release.announcement"), release.linkedinUrl],
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-white sm:text-xl">
        {t("release.title")}
      </h2>
      <dl className="mt-4 grid gap-4 text-sm text-white/65 sm:grid-cols-3">
        <div>
          <dt className="text-white/60">{t("release.version")}</dt>
          <dd className="mt-1 text-white">{release.version}</dd>
        </div>
        <div>
          <dt className="text-white/60">{t("release.commit")}</dt>
          <dd className="mt-1 font-mono" dir="ltr">
            <a
              href={`${release.repositoryUrl}/commit/${release.commit}`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {release.commit.slice(0, 7)}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-white/60">{t("release.released")}</dt>
          <dd className="mt-1 text-white">
            <time dateTime={release.releasedOn}>{date}</time>
          </dd>
        </div>
      </dl>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {links.map(([label, url]) =>
          url ? (
            <li key={label}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {label}
              </a>
            </li>
          ) : null
        )}
      </ul>
    </section>
  );
}
