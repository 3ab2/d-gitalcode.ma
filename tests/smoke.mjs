// Smoke test against a running server: node tests/smoke.mjs [baseUrl]
// Sends GET requests, plus POST requests that must be rejected. Writes nothing.
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
let checks = 0;

function check(ok, message) {
  checks += 1;
  if (!ok) failures.push(message);
}

async function get(path, init) {
  const response = await fetch(base + path, { redirect: "manual", ...init });
  return { response, text: await response.text() };
}

const DIR = { fr: "ltr", en: "ltr", ar: "rtl" };
const PAGES = [
  "", "/about", "/services", "/services/web-development", "/services/mobile-apps",
  "/services/wordpress-plugins", "/services/wordpress-templates", "/portfolio", "/blog", "/contact",
  "/privacy-policy",
];

for (const [locale, dir] of Object.entries(DIR)) {
  for (const page of PAGES) {
    const path = `/${locale}${page}`;
    const { response, text } = await get(path);
    check(response.status === 200, `${path}: status ${response.status}`);
    const html = text.match(/<html[^>]*>/)?.[0] ?? "";
    check(html.includes(`lang="${locale}"`), `${path}: lang`);
    check(html.includes(`dir="${dir}"`), `${path}: dir`);
    check((text.match(/<h1[\s>]/g) ?? []).length === 1, `${path}: exactly one h1`);
    check(/<link rel="canonical" href="https?:\/\/[^"]+"/.test(text), `${path}: canonical`);
    check((text.match(/hrefLang="/gi) ?? []).length >= 4, `${path}: hreflang`);
    check(/<meta name="description" content="[^"]{20,}/.test(text), `${path}: description`);
    const title = text.match(/<title>([^<]*)/)?.[1] ?? "";
    check(title.length > 0 && title.split("D-GITALCODE").length <= 2, `${path}: title "${title}"`);
    check(!/page(?:Error|Loading)\.[a-z]+</.test(text), `${path}: untranslated key`);
    check(!/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<button\b/.test(text.split("<body")[1] ?? ""), `${path}: button inside a link`);
  }
  const missing = await get(`/${locale}/no-such-page`);
  check(missing.response.status === 404, `/${locale}/no-such-page: status ${missing.response.status}`);
  for (const p of ["blog", "portfolio", "services"]) {
    const { response } = await get(`/${locale}/${p}/no-such-entry`);
    check(response.status === 404, `/${locale}/${p}/no-such-entry: status ${response.status}`);
  }
}

const root = await get("/");
check([307, 308].includes(root.response.status) && /\/fr\/?$/.test(root.response.headers.get("location") ?? ""), "/: redirects to /fr");

const admin = await get("/admin");
check([302, 303, 307, 308].includes(admin.response.status) && (admin.response.headers.get("location") ?? "").includes("/admin/login"), "/admin: redirects to the login page");

for (const path of ["/api/admin/submissions", "/api/admin/blog", "/api/admin/settings", "/api/admin/audit-log", "/api/analytics", "/api/notifications"]) {
  const { response } = await get(path);
  check([401, 403].includes(response.status), `${path}: status ${response.status}, expected 401 or 403`);
}

for (const [path, body] of [["/api/contact", { name: "x" }], ["/api/analytics", { event: "Not Valid", metadata: { a: {} } }]]) {
  const { response } = await get(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  check(response.status === 400, `POST ${path}: status ${response.status}, expected 400`);
}

const home = await get("/en");
const h = home.response.headers;
check(/frame-ancestors 'none'/.test(h.get("content-security-policy") ?? ""), "CSP");
check(!/unsafe-eval/.test(h.get("content-security-policy") ?? ""), "CSP allows unsafe-eval");
check(h.get("x-content-type-options") === "nosniff", "nosniff");
check(!h.get("x-powered-by"), "x-powered-by is sent");

for (const path of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/og/default.png", "/offline", "/admin/login"]) {
  const { response } = await get(path);
  check(response.status === 200, `${path}: status ${response.status}`);
}

console.log(failures.length ? failures.join("\n") : "smoke OK");
console.log(`${checks} checks, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
