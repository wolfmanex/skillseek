import { createHash } from "node:crypto";
import { db } from "@/lib/db";

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** The unclaimed, not opted-out company a claim token belongs to, ignoring expiry (opt-out works after it). */
export async function companyForToken(token: string) {
  if (!token) return null;
  const company = await db.company.findUnique({ where: { claimTokenHash: sha256(token) } });
  if (!company || company.claimedAt || company.optedOutAt) return null;
  return company;
}

/** The claim page's view of a token: the company, or why the link doesn't work. */
export async function lookupClaim(token: string) {
  const company = await companyForToken(token);
  if (!company) return { state: "invalid" as const };
  if (company.claimTokenExpiresAt && company.claimTokenExpiresAt < new Date()) return { state: "expired" as const, company };
  return { state: "ok" as const, company };
}
