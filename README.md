# Skillseek

Skillseek, the app and the service, is owned and operated by **Wolfman OÜ**. Copyright © 2026 Wolfman OÜ. All rights reserved.

A matchmaking platform for construction work across the EU. Main contractors post jobs and work packages; subcontractors and specialists (skilled tradespeople) get matched to them, apply or get invited, and chat in one place.

## What's in the MVP

- **Three roles**: main contractor, subcontractor (company), specialist (individual). Contractors and subcontractors can post jobs; subcontractors and specialists can apply.
- **Profiles**: trades, home country and the EU countries they work in, certificates, experience, hourly rate, availability, project photos (Cloudflare R2), portfolio links, company registry code.
- **Job postings**: trades needed, country and city, dates, budget range, who is wanted (subcontractors, specialists or both), required certificates. Status flow: open, in progress, completed, closed.
- **Matching**: rule-based score (0–100) in `src/lib/matching.ts`: trade overlap 40, works in the job's country 25, available by the start date 15, required certificates 15, verified 5. Owners see ranked "Suggested pros" on each open job; pros see "Jobs that match you" on their dashboard.
- **Apply and invite**: pros apply with a note; owners invite suggested pros, then shortlist, accept or decline.
- **Messaging**: one conversation per application, refreshing every 5 seconds, with unread counts. Email notifications for applications, invites, shortlist/accept and new messages (via Resend if configured; logged to the console otherwise).
- **Trust**: reviews both ways once a job is marked completed; admins mark profiles as verified (e.g. after checking the registry code).
- **Languages**: English, Estonian and Finnish, switchable in the header (`src/lib/i18n`). Trade names are stored in all three languages; country names come from `Intl.DisplayNames` in the chosen language.

- **Sign-in**: email and password, or a one-time email sign-in link (also the way back in after a forgotten password). Passwords are changed on the Account page.

Out of scope for now: payments, contracts, scheduling, native apps.

## Stack

Next.js 16 (App Router, server actions) · TypeScript · Tailwind CSS 4 · PostgreSQL + Prisma 6 · email/password and email-link auth with database sessions · Resend · Cloudflare R2 · Vitest.

## Running locally

```bash
cp .env.example .env          # set DATABASE_URL to a Postgres database
npm install
npx prisma migrate dev        # create tables
npm run db:demo               # demo users, jobs, a conversation and a review
npm run dev
```

Demo accounts (password `demo1234`): `admin@skillseek.test` (main contractor and admin), `elekter@skillseek.test` and `toru@skillseek.test` (subcontractors), `plaatija@skillseek.test`, `keevitaja@skillseek.test` and `puusepp@skillseek.test` (specialists).

Trades are added by a migration. Make someone an admin with:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'you@example.com';
```

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Deploying

See [docs/DEPLOY.md](docs/DEPLOY.md) for the free-tier setup: Vercel (Frankfurt), Neon, Resend and Cloudflare R2. Migrations, including the trade list, run automatically during the Vercel build.
