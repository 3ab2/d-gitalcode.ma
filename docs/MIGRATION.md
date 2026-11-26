# GitHub Organization Migration Guide

Prepare and publish **D-GITALCODE Platform** under the [dgitalcode](https://github.com/dgitalcode) GitHub organization.

> **Do not push until the organization repo is created and access is confirmed.**

---

## Pre-migration checklist

- [x] Branding updated to D-GITALCODE (logos, metadata, footer, i18n)
- [x] Personal emails replaced with `dgitalcode@gmail.com`
- [x] Repository references point to `github.com/dgitalcode/d-gitalcode.ma`
- [x] `.env.example` contains placeholders only — no real secrets
- [x] README, CONTRIBUTING, LICENSE updated for commercial presentation
- [x] Unused default assets removed (`vercel.svg`, `file.svg`, `window.svg`)
- [ ] Portfolio screenshots captured (see `docs/screenshots/README.md`)
- [ ] Production env vars updated on Vercel after migration
- [ ] DNS / domain `dgitalcode.ma` verified

---

## Migration steps

### 1. Create the organization repository

1. Log in to GitHub as the `dgitalcode` organization owner.
2. Create a new repository: **`d-gitalcode.ma`** (or `platform` if you prefer a shorter name).
3. Set visibility to **Public** for portfolio showcase.
4. Do **not** initialize with README (this repo already has one).

### 2. Update local remote

```bash
# Add the new org remote (keep origin as backup until verified)
git remote add dgitalcode https://github.com/dgitalcode/d-gitalcode.ma.git

# Verify remotes
git remote -v
```

### 3. Push to the organization

```bash
git push -u dgitalcode main
```

After verification, optionally rename or remove the old `3ab2` remote:

```bash
git remote remove origin
git remote rename dgitalcode origin
```

### 4. Update external references

| Service | Action |
|---------|--------|
| **Vercel** | Reconnect Git integration to `dgitalcode/d-gitalcode.ma` |
| **Neon / Supabase** | No change (connection string stays in env) |
| **Resend** | Verify sender domain DNS |
| **Cloudinary** | No change |
| **Upstash** | No change |
| **Google Search Console** | Update sitemap URL if domain changes |
| **Social links** | Admin → Social already seeds `github.com/dgitalcode` |

### 5. Archive or redirect old repository

On `3ab2/d-gitalcode.ma`:

1. Add a deprecation notice to the README pointing to `github.com/dgitalcode/d-gitalcode.ma`.
2. Archive the repository, or set it to redirect via GitHub repo transfer.

**Preferred:** Use GitHub **Transfer repository** to move history to the org (preserves stars, issues, PRs).

```text
Settings → General → Transfer ownership → dgitalcode
```

### 6. Git history

A clean history rewrite is **not required** for this migration. The existing history contains no committed secrets.

If you want a fresh public history (optional):

```bash
# Only if you explicitly want a single initial commit
git checkout --orphan fresh-main
git add -A
git commit -m "chore: initial public release under D-GITALCODE organization"
git branch -M main
git push -u dgitalcode main --force
```

> ⚠️ Force push destroys history. Only do this on a new empty org repo.

---

## Post-migration verification

```bash
npm install
npm run lint
npm run type-check
npm run build
```

Manual checks:

- [ ] `https://dgitalcode.ma` loads correctly
- [ ] Admin login works
- [ ] Contact form sends notification email
- [ ] Leads inbox receives SSE notifications
- [ ] Blog, portfolio, services pages render in FR / EN / AR
- [ ] Mobile and iOS Safari tested
- [ ] PWA install prompt works

---

## Contact

Migration questions: **dgitalcode@gmail.com**
