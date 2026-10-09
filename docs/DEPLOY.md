# Deploying Skillseek on free tiers

The setup: **Vercel Hobby** (app, Frankfurt `fra1`), **Neon free** (Postgres, Frankfurt), **Resend free** (sign-in and notification email) and **Cloudflare R2** (photos, EU bucket). Each account takes a few minutes. Database migrations and the trade list are applied automatically on every deploy.

> Vercel Hobby is for non-commercial use. It's fine for testing; switch to Pro before charging customers.

## 1. Vercel: import the repo

1. Sign up at <https://vercel.com/signup> with **Continue with GitHub**.
2. **Add New → Project**, then import `wolfmanex/skillseek`. If it isn't listed, choose **Adjust GitHub App Permissions** and give Vercel access to the repo.
3. Keep the defaults (framework Next.js; the build uses the repo's `vercel-build` script) and click **Deploy**. This first deploy fails because there is no database yet. That's expected.

## 2. Neon: add the database from inside Vercel

1. In the Vercel project, open **Storage → Create Database → Neon**, and accept the Neon terms (this creates a free Neon account linked to Vercel).
2. Pick region **AWS Europe Central 1 (Frankfurt)**, name it `skillseek`, and connect it to the project for all environments.
3. Vercel now has `DATABASE_URL` and `DATABASE_URL_UNPOOLED` set. Nothing to copy by hand.

## 3. Resend: email

1. Sign up at <https://resend.com>, then **API Keys → Create API Key** with *Sending access*.
2. In Vercel **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = the key
   - `EMAIL_FROM` = `Skillseek <onboarding@resend.dev>`

> Until you verify your own domain in Resend (**Domains → Add Domain**, pick the EU region, add the DNS records it shows), Resend only delivers to **your own account email**. That's enough to test sign-in links yourself; verify a domain before inviting testers, then change `EMAIL_FROM` to e.g. `Skillseek <noreply@skillseek.ee>`.

## 4. Cloudflare R2: photos

1. Sign up at <https://dash.cloudflare.com/sign-up>, open **R2 Object Storage** and activate it. Cloudflare asks for a card, but the free tier covers 10 GB and egress is free.
2. **Create bucket**: name `skillseek-photos`, location **Specify jurisdiction → European Union (EU)**.
3. In the bucket, go to **Settings → Public access → R2.dev subdomain → Allow**. Copy the `https://pub-….r2.dev` URL.
4. In the same Settings page, under **CORS policy**, choose **Add CORS policy** and paste the policy below. Replace the origin with your Vercel URL.

   ```json
   [
     {
       "AllowedOrigins": ["https://skillseek.vercel.app", "http://localhost:3000"],
       "AllowedMethods": ["PUT"],
       "AllowedHeaders": ["Content-Type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

5. Back in **R2 Object Storage**, choose **Manage API tokens → Create API token**. Give it permission **Object Read & Write**, and limit it to the `skillseek-photos` bucket. Copy the **Access Key ID** and **Secret Access Key**, plus your **Account ID** (shown on the R2 overview page).
6. Add these in Vercel **Settings → Environment Variables**:
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET` = `skillseek-photos`
   - `R2_JURISDICTION` = `eu`
   - `R2_PUBLIC_URL` = the `https://pub-….r2.dev` URL

If the R2 variables are missing, the app still works. It just hides photo uploads.

## 5. Finish

1. Add `APP_URL` = your production URL (e.g. `https://skillseek.vercel.app`) so email links point to the right place.
2. **Deployments → ⋯ → Redeploy**. The build runs the migrations and adds the 20 trades.
3. Open the site, sign up, and make yourself admin in the Neon **SQL Editor** (in the Neon console, or Vercel **Storage → skillseek → Open in Neon**):

   ```sql
   UPDATE "User" SET "isAdmin" = true WHERE email = 'you@example.com';
   ```

4. Optional demo data (fake users and jobs, password `demo1234`): run `DATABASE_URL=<Neon URL> npm run db:demo` from a checkout. Don't do this on a database real testers use.

Health check for uptime monitors: `GET /api/health` returns `{"ok":true}` when the database is reachable.
