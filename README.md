<p align="center">
  <img src="public/logo-desktop.png" alt="D-GITALCODE" width="280" />
</p>

<h1 align="center">D-GITALCODE</h1>

<p align="center">
  <strong>Modern digital agency platform</strong> built with Next.js, TypeScript, Prisma and PostgreSQL.
</p>

<p align="center">
  <a href="https://d-gitalcode.ma">Website</a> ·
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

**D-GITALCODE** is a production-ready digital agency platform designed for web development agencies and software companies. It combines a premium dark-tech marketing website, a full CMS admin dashboard, multilingual support, and integrated lead generation — all in a single modern stack.

Built for real commercial use: portfolio presentation, client acquisition, content management, and scalable deployment.

---

## Features

| Category | Capabilities |
|----------|-------------|
| **Frontend** | Modern dark-tech UI, glassmorphism, responsive mobile-first design, Framer Motion animations |
| **i18n** | Full multilingual support — **French**, **English**, **Arabic** (RTL) |
| **Services** | Service catalog, pricing, request forms, WhatsApp integration |
| **CMS** | Blog, portfolio, services, social links, site statistics |
| **Leads** | Contact form, service requests, submissions inbox, email replies |
| **Admin** | Secure dashboard, analytics, audit logging, image uploads |
| **SEO** | Metadata, sitemap, robots.txt, semantic HTML |
| **Auth** | NextAuth credentials-based admin authentication |

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
| Email | [Resend](https://resend.com/) |
| Media | [Cloudinary](https://cloudinary.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Validation | [Zod](https://zod.dev/) + React Hook Form |
| i18n | [i18next](https://www.i18next.com/) |

---

## Project Structure

```
d-gitalcode.ma/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data (admin, services, blog, portfolio)
├── messages/               # i18n translation files (fr, en, ar)
├── public/                 # Static assets (logos, hero, images)
├── scripts/                # Asset optimization scripts
├── src/
│   ├── app/
│   │   ├── [locale]/       # Public pages (FR / EN / AR)
│   │   ├── admin/          # Admin dashboard & login
│   │   └── api/            # API routes (CMS, auth, contact)
│   ├── components/
│   │   ├── admin/          # Dashboard UI components
│   │   ├── brand/          # Logo, hero illustration
│   │   ├── contact/        # Contact forms
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, footer, navigation
│   │   ├── services/       # Service cards & modals
│   │   ├── social/         # Social link components
│   │   └── ui/             # Reusable UI primitives
│   ├── config/             # App configuration
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Server utilities (auth, prisma, email, i18n)
│   ├── types/              # TypeScript declarations
│   └── middleware.ts       # Locale routing & admin protection
├── docker-compose.yml      # Local PostgreSQL (optional)
├── .env.example            # Environment variables template
└── next.config.ts          # Next.js configuration
```

---

## Installation

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** 14+ (local, [Neon](https://neon.tech), or [Supabase](https://supabase.com))
- Accounts (optional): [Resend](https://resend.com), [Cloudinary](https://cloudinary.com)

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

Default admin credentials are set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (see seed).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | NextAuth secret (`openssl rand -base64 32`) |
| `AUTH_URL` | ✅ | App URL (`http://localhost:3000` in dev) |
| `RESEND_API_KEY` | ⚠️ | Resend API key for transactional email |
| `EMAIL_FROM` | ⚠️ | Sender address for emails |
| `ADMIN_EMAIL` | ✅ | Admin account email (seed) |
| `ADMIN_PASSWORD` | ✅ | Admin account password (seed) |
| `ADMIN_EMAIL_NOTIFY` | ⚠️ | Inbox for contact form notifications |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ⚠️ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ⚠️ | Cloudinary API secret |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ⚠️ | WhatsApp number (international format) |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ | Public site URL (SEO, sitemap) |
| `NEXT_PUBLIC_SITE_NAME` | ⚠️ | Site name for metadata |

> ⚠️ = Required for full functionality (email, uploads). The app runs without them in development.

**Legacy aliases** (optional): `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (network accessible) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run assets:optimize` | Optimize brand images (PNG → WebP) |
| `npm run dev:prod` | Build + start production locally |

---

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example`.
4. Deploy — Vercel auto-detects Next.js.

```bash
# Build command (default)
npm run build

# Vercel runs postinstall → prisma generate automatically
```

### PostgreSQL (Neon / Supabase)

1. Create a project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the **pooled** connection string to `DATABASE_URL`.
3. Add `?connect_timeout=30` for serverless cold starts.
4. Run migrations on deploy:

```bash
npx prisma db push
npx prisma db seed
```

### Post-deployment checklist

- [ ] Set `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Generate a strong `AUTH_SECRET`
- [ ] Change default admin password
- [ ] Configure Resend domain verification
- [ ] Set Cloudinary upload presets
- [ ] Test contact form and admin login

---

## Screenshots

> Add screenshots to `docs/screenshots/` and reference them here.

| Page | Preview |
|------|---------|
| Homepage | `docs/screenshots/homepage.png` |
| Services | `docs/screenshots/services.png` |
| Admin Dashboard | `docs/screenshots/admin-dashboard.png` |
| Mobile | `docs/screenshots/mobile.png` |

**How to add screenshots:**

1. Capture at 1440px (desktop) and 390px (mobile).
2. Save as PNG in `docs/screenshots/`.
3. Update this table with `![Alt](./docs/screenshots/filename.png)`.

---

## Security

- **Environment variables** — Never commit `.env`. Use Vercel/hosting secrets in production.
- **Authentication** — Admin routes protected by NextAuth JWT + middleware.
- **API routes** — Admin CRUD endpoints require authenticated session.
- **Audit logging** — Admin actions logged to database.
- **Input validation** — Zod schemas on all form submissions and API inputs.
- **Database** — Parameterized queries via Prisma ORM (no raw SQL injection).

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
