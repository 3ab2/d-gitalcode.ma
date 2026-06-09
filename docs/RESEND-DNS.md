# Resend — DNS setup for `d-igitalcode.ma`

Add these records at your domain registrar (where you bought `d-igitalcode.ma`).
Region: **North Virginia (us-east-1)**

After saving DNS, wait 5–60 minutes, then click **Verify** in the [Resend Domains](https://resend.com/domains) dashboard.

## Domain verification (DKIM)

| Type | Name / Host | Value / Content | TTL |
|------|-------------|-----------------|-----|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcSKsT3aTvS8io89Vy8ig308QnRD7OOoQBndSvc9v7XhZwvN3m2mlTnd1rAt9vlYmluBrbac1tgYRni12lTf+ymAJJBYS0KiDQ/Z1E/W41Hd1s81B6UcQblwq1/G5JEVrx3n2j9QFtdzNO72DllmJT5U92inPvvg2KW1f+ZQAXmwIDAQAB` | Auto |

> Some registrars want the full name: `resend._domainkey.d-igitalcode.ma`

## Enable sending (SPF)

| Type | Name / Host | Value / Content | Priority | TTL |
|------|-------------|-----------------|----------|-----|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 | Auto |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — | Auto |

## DMARC (optional, recommended)

| Type | Name / Host | Value / Content | TTL |
|------|-------------|-----------------|-----|
| TXT | `_dmarc` | `v=DMARC1; p=none;` | Auto |

## Enable receiving (optional)

| Type | Name / Host | Value / Content | Priority | TTL |
|------|-------------|-----------------|----------|-----|
| MX | `@` | `inbound-smtp.us-east-1.amazonaws.com` | 10 | Auto |

> Receiving is only needed if you want inbound email to `@d-igitalcode.ma` addresses in Resend.

## After verification

Update environment variables (local `.env` + Vercel):

```env
EMAIL_FROM="D-GITALCODE <noreply@d-igitalcode.ma>"
```

Redeploy, then test admin replies:

```bash
npm run email:test
npx tsx scripts/test-reply-email.ts client@example.com
```

## Registrar tips

- **Host column**: use `@` for root, or `send` / `resend._domainkey` as subdomains (depends on registrar UI).
- **Cloudflare**: set proxy **DNS only** (grey cloud) for MX/TXT records.
- **Conflict**: remove old SPF TXT on `@` if present; merge includes instead of duplicate SPF records.
