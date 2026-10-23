import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { TRADES } from "@/lib/constants";
import { ACTIVE_STATUS, type CompanyInput } from "@/lib/company-import";

const TRADE_SLUGS = new Set(TRADES.map((t) => t.slug));
const BATCH = 500;

/**
 * Inserts active companies and refreshes known ones by registry code, one SQL statement per batch so a full
 * import over a slow link stays fast. Firms that opted out are never updated, so their
 * wiped contact details stay wiped. Claim state is never touched.
 */
export async function upsertCompanies(db: PrismaClient, inputs: CompanyInput[], source = "ariregister") {
  let written = 0;
  for (let i = 0; i < inputs.length; i += BATCH) {
    const rows = inputs.slice(i, i + BATCH).map((c) => ({
      ...c,
      id: randomUUID(),
      source,
      tradeSlugs: c.tradeSlugs.filter((s) => TRADE_SLUGS.has(s)),
      foundedAt: c.foundedAt?.toISOString() ?? null,
    }));
    written += await db.$executeRaw`
      INSERT INTO "Company" ("id", "regCode", "name", "legalForm", "status", "address", "county", "city",
        "email", "phone", "website", "emtakCodes", "mainEmtak", "tradeSlugs", "foundedAt", "source", "updatedAt")
      SELECT "id", "regCode", "name", "legalForm", "status", "address", "county", "city",
        "email", "phone", "website", "emtakCodes", "mainEmtak", "tradeSlugs", "foundedAt", "source", NOW()
      FROM jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) AS x(
        "id" text, "regCode" text, "name" text, "legalForm" text, "status" text, "address" text,
        "county" text, "city" text, "email" text, "phone" text, "website" text, "emtakCodes" text[],
        "mainEmtak" text, "tradeSlugs" text[], "foundedAt" timestamp(3), "source" text)
      WHERE x."status" = ${ACTIVE_STATUS} OR EXISTS (SELECT 1 FROM "Company" c WHERE c."regCode" = x."regCode")
      ON CONFLICT ("regCode") DO UPDATE SET
        "name" = EXCLUDED."name", "legalForm" = EXCLUDED."legalForm", "status" = EXCLUDED."status",
        "address" = EXCLUDED."address", "county" = EXCLUDED."county", "city" = EXCLUDED."city",
        "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "website" = EXCLUDED."website",
        "emtakCodes" = EXCLUDED."emtakCodes", "mainEmtak" = EXCLUDED."mainEmtak",
        "tradeSlugs" = EXCLUDED."tradeSlugs", "foundedAt" = EXCLUDED."foundedAt", "updatedAt" = NOW()
      WHERE "Company"."optedOutAt" IS NULL`;
  }
  return written;
}

// What an opt-out or expiry leaves behind: the registry code and name, as a do-not-contact entry.
export const SUPPRESSED_FIELDS = {
  email: null,
  phone: null,
  website: null,
  address: null,
  claimTokenHash: null,
  claimTokenExpiresAt: null,
  invitedEmail: null,
};

export const INVITE_RETENTION_DAYS = 365;

/** Wipes contact details of firms that didn't claim within a year of their invitation (privacy policy). */
export async function expireStaleInvites(db: PrismaClient) {
  const cutoff = new Date(Date.now() - INVITE_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const { count } = await db.company.updateMany({
    where: { claimedAt: null, optedOutAt: null, invitedAt: { lt: cutoff } },
    data: { ...SUPPRESSED_FIELDS, optedOutAt: new Date() },
  });
  return count;
}
