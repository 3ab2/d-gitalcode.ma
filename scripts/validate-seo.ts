/**
 * SEO validation script — run after build: npx tsx scripts/validate-seo.ts [baseUrl]
 */
const baseUrl = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const PUBLIC_PAGES = [
  { path: "/fr", name: "homepage FR" },
  { path: "/en", name: "homepage EN" },
  { path: "/ar", name: "homepage AR" },
  { path: "/fr/blog", name: "blog index FR" },
  { path: "/en/blog", name: "blog index EN" },
  { path: "/fr/about", name: "about FR" },
  { path: "/fr/contact", name: "contact FR" },
  { path: "/fr/portfolio", name: "portfolio FR" },
  { path: "/fr/services/web-development", name: "services FR" },
  {
    path: "/fr/blog/nextjs-vs-traditional-cms-2026",
    name: "blog article FR",
  },
];

const NOINDEX_PAGES = [
  "/fr/login",
  "/fr/register",
  "/fr/support",
];

type Check = { name: string; pass: boolean; detail?: string };

function hasCanonical(html: string): boolean {
  return /rel="canonical"\s+href="[^"]+"/.test(html);
}

function hasHreflang(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes('hreflang="fr"') &&
    lower.includes('hreflang="en"') &&
    lower.includes('hreflang="ar"') &&
    lower.includes('hreflang="x-default"')
  );
}

function hasOgImage(html: string): boolean {
  return /property="og:image"/.test(html);
}

function hasJsonLd(html: string): boolean {
  return html.includes("application/ld+json");
}

function isNoindex(html: string): boolean {
  return /name="robots"\s+content="[^"]*noindex/i.test(html);
}

async function fetchHtml(path: string): Promise<string> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.text();
}

async function main() {
  const checks: Check[] = [];

  // robots.txt
  try {
    const robots = await fetch(`${baseUrl}/robots.txt`).then((r) => r.text());
    checks.push({
      name: "robots.txt sitemap",
      pass: robots.includes("Sitemap:"),
    });
    checks.push({
      name: "robots.txt blocks admin",
      pass: robots.includes("Disallow: /admin/"),
    });
  } catch (e) {
    checks.push({
      name: "robots.txt",
      pass: false,
      detail: String(e),
    });
  }

  // sitemap
  try {
    const sitemap = await fetch(`${baseUrl}/sitemap.xml`).then((r) => r.text());
    const urlCount = (sitemap.match(/<loc>/g) || []).length;
    checks.push({
      name: "sitemap.xml URLs",
      pass: urlCount >= 150,
      detail: `${urlCount} URLs`,
    });
    checks.push({
      name: "sitemap hreflang alternates",
      pass: sitemap.includes("xhtml:link") || sitemap.includes("alternate"),
      detail: sitemap.includes("xhtml:link") ? "xhtml:link present" : "checking alternates",
    });
  } catch (e) {
    checks.push({ name: "sitemap.xml", pass: false, detail: String(e) });
  }

  for (const page of PUBLIC_PAGES) {
    try {
      const html = await fetchHtml(page.path);
      checks.push({
        name: `${page.name}: canonical`,
        pass: hasCanonical(html),
      });
      checks.push({
        name: `${page.name}: hreflang`,
        pass: hasHreflang(html),
      });
      if (page.path.includes("/blog/nextjs")) {
        checks.push({
          name: `${page.name}: JSON-LD`,
          pass: hasJsonLd(html),
        });
      }
    } catch (e) {
      checks.push({
        name: page.name,
        pass: false,
        detail: String(e),
      });
    }
  }

  // OG image on homepage
  try {
    const home = await fetchHtml("/fr");
    checks.push({
      name: "homepage: og:image",
      pass: hasOgImage(home),
    });
  } catch {
    /* already reported */
  }

  for (const path of NOINDEX_PAGES) {
    try {
      const html = await fetchHtml(path);
      checks.push({
        name: `noindex ${path}`,
        pass: isNoindex(html),
      });
    } catch (e) {
      checks.push({
        name: `noindex ${path}`,
        pass: false,
        detail: String(e),
      });
    }
  }

  const passed = checks.filter((c) => c.pass).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  console.log("\n=== SEO Validation Report ===\n");
  for (const c of checks) {
    console.log(`${c.pass ? "PASS" : "FAIL"} ${c.name}${c.detail ? ` (${c.detail})` : ""}`);
  }
  console.log(`\nResult: ${passed}/${total} checks passed (${score}%)\n`);

  process.exit(passed === total ? 0 : 1);
}

main();
