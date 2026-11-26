# D-GITALCODE Platform — Publication Audit Report

**Date:** June 14, 2026  
**Project:** D-GITALCODE Platform (`d-gitalcode.ma`)  
**Target:** Publication under [github.com/dgitalcode](https://github.com/dgitalcode)  
**Status:** Ready for org migration (pending screenshots + push)

---

## Executive summary

The D-GITALCODE Platform has been audited and prepared for commercial portfolio publication. Branding, documentation, security posture, and client-facing UX have been upgraded to production showcase standards. No committed secrets were found. The repository is ready for migration to the D-GITALCODE GitHub organization — **do not push until the org repo is created**.

> **Note:** The brief referenced [D-GITALCODE-Document-Media-Extractor-Pro](https://github.com/3ab2/D-GITALCODE-Document-Media-Extractor-Pro) (a Python desktop utility). The active workspace is the **D-GITALCODE agency platform** (`d-gitalcode.ma`). This audit covers the platform project. The Document Media Extractor is a separate product and would require its own publication pass.

---

## 1. Branding & identity changes

| Item | Before | After |
|------|--------|-------|
| Contact email | `3ab2uelkarch2006@gmail.com` | `dgitalcode@gmail.com` |
| Admin defaults | Personal Gmail | `dgitalcode@gmail.com` |
| GitHub org | `github.com/3ab2` | `github.com/dgitalcode` |
| Package author | Abdelhamid (personal) | D-GITALCODE (company) |
| LICENSE holder | Abdelhamid | D-GITALCODE — dgitalcode.ma |
| Footer credits | Copyright only | dgitalcode.ma + dgitalcode@gmail.com |
| About/trust copy | Founder name (ELKARCH ABDELHAMID) | Professional team language |
| Repository URL | `3ab2/d-gitalcode.ma` | `dgitalcode/d-gitalcode.ma` |

**Unchanged (intentional):**

- Visual brand: D-GITALCODE logos, colors (`#25d366`, `#6c4cf1`, `#0a0f14`), PWA icons
- Email sending domain: `d-igitalcode.ma` (Resend verified domain — separate from public site URL)
- Live domain references: `d-gitalcode.ma` remains in SEO defaults until `dgitalcode.ma` DNS is fully cut over

---

## 2. Files modified

### Configuration & branding
- `src/config/contact.ts`
- `src/config/social-links.ts`
- `package.json`
- `LICENSE`
- `.env.example`
- `prisma/seed.ts`

### Internationalization
- `messages/en/common.json`
- `messages/fr/common.json`
- `messages/ar/common.json`

### UI / UX
- `src/app/[locale]/not-found.tsx` — enhanced 404 with glass card
- `src/app/[locale]/error.tsx` — **new** localized error boundary
- `src/app/[locale]/loading.tsx` — **new** route loading state
- `src/components/blog/BlogListClient.tsx` — improved empty state
- `src/components/layout/Footer.tsx` — company credits

### Documentation
- `README.md` — full commercial rewrite
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `docs/PORTFOLIO.md` — **new**
- `docs/MIGRATION.md` — **new**
- `docs/screenshots/README.md` — expanded capture guide

### Removed assets
- `public/vercel.svg` (unused Next.js default)
- `public/file.svg` (unused)
- `public/window.svg` (unused)

---

## 3. Security findings

| Finding | Severity | Status |
|---------|----------|--------|
| Committed `.env` with real secrets | — | ✅ Not found — `.env` gitignored |
| Hardcoded API keys in source | — | ✅ All via `process.env` |
| Personal email in defaults | Low | ✅ Replaced with `dgitalcode@gmail.com` |
| Default admin password `ChangeMe123!` | Info | ⚠️ Documented placeholder — change after seed in production |
| Docker dev credentials `dgitalcode/dgitalcode` | Info | ✅ Local dev only, documented |
| Test script invalid Resend key | Info | ✅ Intentional test fixture in `scripts/test-resend-errors.ts` |
| PII in seed data | Low | ✅ No real client data in seed |
| Legacy support/auth i18n strings | Low | ℹ️ Dead strings remain (feature removed) — cosmetic only |

**Recommendation before publish:** Rotate `AUTH_SECRET` and admin password on production after migration.

---

## 4. README improvements

The README now includes:

- Commercial overview with problem/solution framing
- Target users and main benefits
- Full feature matrix and lead workflow
- Screenshots section with pending capture list
- Tech stack table
- Installation, environment variables, usage guide
- Project structure tree
- Security notes with private disclosure contact
- Roadmap through Q4 2026
- D-GITALCODE credits block

---

## 5. Portfolio description

See [docs/PORTFOLIO.md](./PORTFOLIO.md) for the full portfolio page copy.

**Short summary:**

> D-GITALCODE Platform is a production-ready digital agency system combining a conversion-focused multilingual marketing site with a secure CMS admin and real-time lead management — built on Next.js 16, PostgreSQL, and modern SaaS-grade UX.

---

## 6. Recommended screenshots

See [docs/screenshots/README.md](./screenshots/README.md) for the complete 20-shot capture guide.

**Priority captures:** homepage, agency map, services, portfolio detail, blog, contact, admin dashboard, leads inbox, mobile home, PWA iOS.

---

## 7. GitHub migration preparation

See [docs/MIGRATION.md](./MIGRATION.md) for step-by-step instructions.

**Completed:**
- All in-repo references updated to `github.com/dgitalcode`
- Migration guide written
- Git history audit: no secrets in history — rewrite not required

**Pending (manual):**
- Create `dgitalcode/d-gitalcode.ma` on GitHub
- Transfer or push repository
- Reconnect Vercel to org repo
- Capture portfolio screenshots

---

## 8. UI / UX review summary

| Area | Assessment | Action taken |
|------|------------|--------------|
| Visual consistency | Strong dark-tech brand | No breaking changes |
| Typography | Geist sans, consistent scale | Maintained |
| Empty states | Blog was minimal | Enhanced blog empty card |
| Error states | No route-level boundary | Added `error.tsx` |
| Loading states | No route-level loader | Added `loading.tsx` |
| 404 page | Basic | Enhanced with description + card |
| Mobile responsiveness | Mobile-first codebase | Verified patterns intact |
| Accessibility | Good baseline | Added `role="status"` on loader; icon `aria-hidden` |
| iOS Safari | PWA + dvh fixes present | No regression |

**Remaining UX recommendations:**
- Add route-level `error.tsx` for `/admin` routes
- Capture and embed screenshots in README
- Remove dead support/register i18n strings in a future cleanup pass
- Consider `prefers-reduced-motion` audit on agency map section

---

## 9. Remaining recommendations before publishing

1. **Capture screenshots** — follow `docs/screenshots/README.md` (10 required)
2. **Create org repo** — `github.com/dgitalcode/d-gitalcode.ma`
3. **Transfer repository** from `3ab2` (preserves history) or push to new org remote
4. **Update Vercel** Git integration to org repository
5. **Verify DNS** — ensure `dgitalcode.ma` points to production
6. **Rotate credentials** — `AUTH_SECRET`, admin password, API keys after go-live
7. **Update live site settings** — admin panel contact email if DB has old value from seed
8. **Archive old repo** — add deprecation notice on `3ab2/d-gitalcode.ma`
9. **Separate project** — run a similar publication pass on Document Media Extractor Pro if showcasing that product

---

## 10. Technologies used (portfolio stack)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Database | PostgreSQL 16, Prisma 6 |
| Auth | NextAuth v5 |
| Email | Resend |
| Media | Cloudinary |
| Cache | Upstash Redis |
| PWA | Serwist |
| 3D | React Three Fiber |
| i18n | i18next (FR, EN, AR + RTL) |

---

<p align="center">
  <strong>D-GITALCODE</strong> — <a href="https://dgitalcode.ma">dgitalcode.ma</a> · <a href="mailto:dgitalcode@gmail.com">dgitalcode@gmail.com</a>
</p>
