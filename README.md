# Skillseek

A matchmaking platform for construction work in Estonia. Main contractors post jobs and work packages; subcontractors and specialists (skilled tradespeople) get matched to them, apply or get invited, and chat in one place.

## What's in the MVP

- **Three roles**: main contractor, subcontractor (company), specialist (individual). Contractors and subcontractors can post jobs; subcontractors and specialists can apply.
- **Profiles**: trades, home county and counties served, certificates, experience, hourly rate, availability, portfolio links, company registry code.
- **Job postings**: trades needed, county and city, dates, budget range, who is wanted (subcontractors, specialists or both), required certificates. Status flow: open, in progress, completed, closed.
- **Matching**: rule-based score (0–100) in `src/lib/matching.ts`: trade overlap 40, works in the job's county 25, available by the start date 15, required certificates 15, verified 5. Owners see ranked "Suggested pros" on each open job; pros see "Jobs that match you" on their dashboard.
- **Apply and invite**: pros apply with a note; owners invite suggested pros, then shortlist, accept or decline.
- **Messaging**: one conversation per application, refreshing every 5 seconds, with unread counts. Email notifications for applications, invites, shortlist/accept and new messages (via Resend if configured; logged to the console otherwise).
- **Trust**: reviews both ways once a job is marked completed; admins mark profiles as verified (e.g. after checking the registry code).
- **Languages**: English and Estonian, switchable in the header (`src/lib/i18n`). All 15 Estonian counties and trade names are bilingual.

Out of scope for now: payments, contracts, scheduling, file/photo uploads, native apps.

## Stack

Next.js 16 (App Router, server actions) · TypeScript · Tailwind CSS 4 · PostgreSQL + Prisma 6 · email/password auth with database sessions · Vitest.

## Running locally

```bash
cp .env.example .env          # set DATABASE_URL to a Postgres database
npm install
npx prisma migrate dev        # create tables
npm run db:demo               # trades + demo users, jobs, a conversation and a review
npm run dev
```

Demo accounts (password `demo1234`): `admin@skillseek.test` (main contractor and admin), `elekter@skillseek.test` and `toru@skillseek.test` (subcontractors), `plaatija@skillseek.test`, `keevitaja@skillseek.test` and `puusepp@skillseek.test` (specialists).

For production, seed only the trades with `npm run db:seed`, and make someone an admin with:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'you@example.com';
```

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Deploying

Any Node host works. The simplest path is Vercel plus a Neon Postgres database: set `DATABASE_URL`, `APP_URL`, and optionally `RESEND_API_KEY` and `EMAIL_FROM`, and run `npx prisma migrate deploy` against the production database before the first deploy.
