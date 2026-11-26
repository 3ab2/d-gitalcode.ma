# Release Readiness

## Before every release

```bash
npm run lint && npm run type-check && npm test
npm run build && npm start      # then: npm run test:smoke -- http://localhost:3000
npm audit --omit=dev --audit-level=critical
```

## Deployment

- Vercel project `d-gitalcode.ma`, production domain `d-gitalcodema.vercel.app`. A push to `main` deploys to production.
- Preview deployments have no environment variables, so they run without a database.
- To check a production build before it goes live: `vercel deploy --prod --skip-domain` from a clean tree without `.env`, test the returned address, then merge.
- Rollback: promote the previous production deployment in Vercel. No schema change is included in the November 2026 release, so rollback is code only. Baseline: `dpl_6wBiqVS8gaDyTct5MaKQro9k63Cz`.
- After deployment: `node tests/smoke.mjs https://d-gitalcodema.vercel.app`.

## Email

Lead notifications are sent with Resend. Until a domain is verified there, Resend delivers only to the account owner, so the code falls back to that address. To send from a business address: own a domain, add the DNS records Resend shows for it, verify it, set `EMAIL_FROM` in Vercel, and redeploy. The domains named in older documents (`d-gitalcode.ma`, `dgitalcode.ma`, `d-igitalcode.ma`) did not exist in DNS on 2026-11-25.

## Claims

`src/config/verified-facts.ts` decides which statistics and repository links may appear. `src/config/releases.ts` holds verified releases of portfolio projects.

## Known issues

- The privacy policy is French only; one of its links is distinguishable only by colour.
- Production has no Redis variables, so rate limits are kept in memory per instance.
- Prisma 6 command-line packages carry 4 high advisories; the fix is Prisma 7.
- `src/middleware.ts` uses a name Next.js has deprecated.
- There is no initial migration: a new database needs `prisma db push`.
- The build opens one database pool per worker. Use a pooled URL or `connection_limit`.
