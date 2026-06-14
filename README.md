<p align="center">
  <img src="public/logo-desktop.webp" alt="D-GITALCODE" width="280" />
</p>

<h1 align="center">D-GITALCODE</h1>

<p align="center">
  <strong>Production-ready digital agency platform</strong> — marketing site, CMS admin, lead management, and multilingual support on a modern Next.js stack.
</p>

<p align="center">
  <a href="https://d-gitalcode.ma">Live site</a> ·
  <a href="https://github.com/3ab2/d-gitalcode.ma">Repository</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

---

## Overview

**D-GITALCODE** is a full-stack digital agency platform built for real commercial use: portfolio presentation, service catalog, blog content, lead capture, and a secure admin dashboard — all optimized for desktop and mobile (including iOS Safari).

The public site is multilingual (French, English, Arabic with RTL), SEO-optimized, and installable as a PWA. The admin area provides CMS tools, real-time lead notifications, and streamlined reply workflows via WhatsApp and email.

---

## Latest updates

| Area | What's new |
|------|------------|
| **Admin Leads** | Dedicated leads inbox with search, filters, status workflow (`NEW` → `CLOSED`), daily stats, and deep-link support from notifications |
| **Lead replies** | One-click **Reply via WhatsApp** and **Reply via Email** with professional pre-filled messages (opens native apps — no in-app email tracking) |
| **Removed** | In-app Resend reply tracking (`SubmissionReply`), client support chat, user registration/login, and admin messaging — simplified to admin-only + external reply channels |
| **Portfolio** | Individual project detail pages with case-study sections, technologies, and conversion CTAs |
| **Services** | Category landing pages, service request modals, and WhatsApp conversion flows |
| **Homepage** | Interactive agency map (3D on desktop, mobile fallback), trust section, hero intro animation with reduced-motion support |
| **Mobile** | iOS Safari fixes, touch-safe modals, responsive admin sidebar, coarse-pointer hero timing |
| **Infrastructure** | Upstash Redis rate limiting (required in production), security headers, Serwist PWA |

---

## Features

| Category | Capabilities |
|----------|-------------|
| **Frontend** | Dark-tech UI, glassmorphism, Framer Motion, mobile-first responsive layout |
| **i18n** | French, English, Arabic (RTL) via i18next |
| **Services** | Catalog by category, pricing, request forms, WhatsApp CTAs |
| **Portfolio** | Project grid, detail pages, technologies, live/demo links |
| **Blog** | 50+ SEO articles, categories, tags, cover images, dynamic OG images, CTA analytics |
| **Leads** | Contact & service-request forms, duplicate detection, admin inbox, WhatsApp/email replies |
| **Admin** | Dashboard, CMS (services, portfolio, blog, social), leads, settings, audit log |
| **Notifications** | Real-time SSE notification center for new leads |
| **PWA** | Serwist service worker, offline page, iOS install instructions |
| **SEO** | Metadata, JSON-LD, sitemap, robots.txt, semantic HTML |
| **Auth** | NextAuth v5 credentials — admin-only access |
| **Security** | CSP headers, Zod validation, bcrypt passwords, distributed rate limiting |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| ORM | [Prisma 6](https://www.prisma.io/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| Auth | [NextAuth.js v5](https://authjs.dev/) |
| Email | [Resend](https://resend.com/) (contact notifications only) |
| Media | [Cloudinary](https://cloudinary.com/) |
| Cache / rate limit | [Upstash Redis](https://upstash.com/) |
| PWA | [Serwist](https://serwist.pages.dev/) |
| 3D | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + Drei |
| Animation | [Framer Motion](https://www.framer.com/motion/) + Lottie |
| Validation | [Zod](https://zod.dev/) + React Hook Form |
| i18n | [i18next](https://www.i18next.com/) |

---

## Project Structure

```
d-gitalcode.ma/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # SQL migrations
│   ├── seed.ts                # Seed data (admin, services, blog, portfolio)
│   └── seed-blog.ts           # Blog article seed
├── messages/                  # i18n JSON (fr, en, ar)
├── public/                    # Static assets, PWA icons, brand images
├── scripts/                   # Asset optimization, email/cloudinary tests
├── docs/
│   ├── RESEND-DNS.md          # Resend domain verification guide
│   └── screenshots/           # README screenshots (optional)
├── src/
│   ├── app/
│   │   ├── [locale]/          # Public pages (home, services, portfolio, blog, contact, about)
│   │   ├── admin/             # Admin dashboard & login
│   │   ├── api/               # REST routes (CMS, auth, contact, notifications, analytics)
│   │   ├── manifest.ts        # PWA manifest
│   │   ├── offline/           # Offline fallback page
│   │   └── serwist/           # Service worker routes
│   ├── components/
│   │   ├── admin/             # Dashboard widgets, lead actions
│   │   ├── blog/              # Blog list, TOC, CTA
│   │   ├── brand/             # Logo, hero illustration
│   │   ├── contact/           # Contact forms, trust signals
│   │   ├── conversion/        # Conversion CTAs
│   │   ├── home/              # Hero, agency map, sections
│   │   ├── layout/            # Header, footer, conversion float
│   │   ├── notifications/     # Notification bell & center (SSE)
│   │   ├── portfolio/         # Portfolio detail components
│   │   ├── pwa/               # Install prompts (incl. iOS)
│   │   ├── services/          # Service cards, modals, landing
│   │   └── ui/                # Reusable UI primitives
│   ├── config/                # Cloudinary and app config
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── admin/             # Admin schemas & upload validation
│   │   ├── agency-map/        # Agency map node config
│   │   ├── analytics/         # Blog & CTA analytics
│   │   ├── leads/             # Lead stats & duplicate detection
│   │   ├── i18n/              # Server/client i18n helpers
│   │   └── ...                # auth, email, prisma, seo, whatsapp, etc.
│   └── middleware.ts          # Locale routing, legacy redirects, admin paths
├── docker-compose.yml         # Local PostgreSQL (optional)
├── .env.example               # Environment variables template
└── next.config.ts             # Next.js + Serwist + security headers
```

---

## Installation

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** 14+ (local, [Neon](https://neon.tech), or [Supabase](https://supabase.com))
- Optional: [Resend](https://resend.com), [Cloudinary](https://cloudinary.com), [Upstash](https://upstash.com)

### 1. Clone the repository

```bash
git clone https://github.com/3ab2/d-gitalcode.ma.git
cd d-gitalcode.ma
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables)).

### 4. Set up the database

**Option A — Docker (local)**

```bash
docker compose up -d
```

**Option B — Neon / Supabase**

Create a PostgreSQL database and paste the connection string into `DATABASE_URL`.

Then run:

```bash
npm run db:push
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000/fr](http://localhost:3000/fr)

| Route | URL |
|-------|-----|
| Homepage (FR) | `http://localhost:3000/fr` |
| Admin login | `http://localhost:3000/admin/login` |
| Leads inbox | `http://localhost:3000/admin/submissions` |

Default admin credentials are set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (see seed).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | NextAuth secret (`openssl rand -base64 32`) |
| `AUTH_URL` | ✅ | App URL (`http://localhost:3000` in dev) |
| `ADMIN_EMAIL` | ✅ | Admin account email (seed) |
| `ADMIN_PASSWORD` | ✅ | Admin account password (seed) |
| `RESEND_API_KEY` | ⚠️ | Resend API key for contact notifications |
| `EMAIL_FROM` | ⚠️ | Verified sender address |
| `ADMIN_EMAIL_NOTIFY` | ⚠️ | Inbox for new lead notifications |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ⚠️ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ⚠️ | Cloudinary API secret |
| `UPSTASH_REDIS_REST_URL` | ✅ prod | Upstash Redis REST URL (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ prod | Upstash Redis REST token |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ⚠️ | WhatsApp number (international format) |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ | Public site URL (SEO, sitemap, auth) |
| `NEXT_PUBLIC_SITE_NAME` | ⚠️ | Site name for metadata |

> ⚠️ = Required for full functionality. Email and uploads are optional in local dev; Upstash is required in production for distributed rate limiting.

**Legacy aliases** (optional): `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

See [docs/RESEND-DNS.md](./docs/RESEND-DNS.md) for Resend domain verification.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (network accessible) |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check without emit |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:seed-blog` | Seed blog articles |
| `npm run db:studio` | Open Prisma Studio |
| `npm run assets:optimize` | Optimize brand images (PNG → WebP) |
| `npm run assets:optimize-public` | Optimize public folder images |
| `npm run pwa:icons` | Generate PWA icon set |
| `npm run email:test` | Send test contact notification via Resend |
| `npm run cloudinary:test` | Test Cloudinary upload |
| `npm run dev:prod` | Build + start production locally |

---

## Deployment

### GitHub

1. Ensure all changes are committed on `main`.
2. Push to the remote repository:

```bash
git push origin main
```

Repository: [github.com/3ab2/d-gitalcode.ma](https://github.com/3ab2/d-gitalcode.ma)

### Vercel (recommended)

1. Import the GitHub repository on [Vercel](https://vercel.com).
2. Set the production branch to `main` (auto-deploy on push).
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js.

```bash
# Build command (default)
npm run build

# Install command runs postinstall → prisma generate
```

**Production URLs**

| Environment | URL |
|-------------|-----|
| Vercel | `https://d-gitalcodema.vercel.app` |
| Custom domain | `https://d-gitalcode.ma` |

Set `AUTH_URL`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_SITE_URL` to your production domain.

**Manual production deploy (CLI)**

```bash
npx vercel --prod
```

### PostgreSQL (Neon / Supabase)

1. Create a project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the **pooled** connection string to `DATABASE_URL`.
3. Add `?connect_timeout=30` for serverless cold starts.
4. Apply schema after first deploy:

```bash
npx prisma db push
npx prisma db seed
```

### Post-deployment checklist

- [ ] `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` point to production domain
- [ ] Strong `AUTH_SECRET` generated and set
- [ ] Default admin password changed after seed
- [ ] Resend domain verified ([docs/RESEND-DNS.md](./docs/RESEND-DNS.md))
- [ ] Cloudinary credentials configured for admin uploads
- [ ] Upstash Redis configured for rate limiting
- [ ] Contact form sends notification email
- [ ] Admin login and leads inbox work on mobile
- [ ] WhatsApp reply opens with pre-filled message
- [ ] PWA install works on iOS Safari

---

## Admin Leads workflow

1. A visitor submits a **contact form** or **service request** (or initiates WhatsApp).
2. The submission is stored with status `NEW`; admins receive a real-time notification.
3. In **Admin → Leads**, filter by status, type, service, date, or search text.
4. Open a lead to view full details; status auto-advances to `IN_PROGRESS` on first view.
5. Use **Reply via WhatsApp** or **Reply via Email** — opens the native app with a pre-filled professional message.
6. Update status manually (`READ`, `REPLIED`, `CLOSED`) or delete the lead.

> Lead replies are handled outside the app (WhatsApp / mailto). In-app Resend reply tracking was removed to keep the workflow simple and reliable.

---

## Screenshots

> Add screenshots to `docs/screenshots/` and reference them here.

| Page | Preview |
|------|---------|
| Homepage | `docs/screenshots/homepage.png` |
| Services | `docs/screenshots/services.png` |
| Admin Dashboard | `docs/screenshots/admin-dashboard.png` |
| Leads Inbox | `docs/screenshots/admin-leads.png` |
| Mobile | `docs/screenshots/mobile.png` |

---

## Security

- **Secrets** — Never commit `.env`. Use Vercel/hosting environment variables in production.
- **Authentication** — Admin routes protected by NextAuth JWT + middleware; public registration removed.
- **API routes** — Admin CRUD endpoints require authenticated admin session.
- **Rate limiting** — Upstash Redis-backed limits on contact and auth endpoints.
- **Headers** — CSP, HSTS, X-Frame-Options, and related security headers in `next.config.ts`.
- **Audit logging** — Admin actions logged to the database.
- **Input validation** — Zod schemas on forms and API inputs; HTML sanitized on blog content.
- **Database** — Parameterized queries via Prisma ORM.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Author

**Abdelhamid**  
Founder of [D-GITALCODE](https://d-gitalcode.ma)

- Website: [d-gitalcode.ma](https://d-gitalcode.ma)
- GitHub: [@3ab2](https://github.com/3ab2)
- Email: 3ab2uelkarch2006@gmail.com

---

<p align="center">
  Built with precision by <strong>D-GITALCODE</strong> — Web · Mobile · WordPress · SaaS
</p>
