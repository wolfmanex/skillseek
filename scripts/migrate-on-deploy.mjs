// Runs database migrations during the Vercel build, but only for production.
// Preview builds (one per PR) usually share the production database, so letting
// them migrate would change the live schema before the PR is merged.
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV;
if (env && env !== "production" && process.env.MIGRATE_PREVIEWS !== "1") {
  console.log(`[migrate] Skipping migrations for VERCEL_ENV=${env}`);
} else {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
