"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, getCurrentUser, hashPassword, requireAdmin } from "@/lib/auth";
import { parseCompanyCsv } from "@/lib/company-import";
import { SUPPRESSED_FIELDS, upsertCompanies } from "@/lib/company-store";
import { companyForToken, lookupClaim, sha256 } from "@/lib/claims";
import { appUrl, sendEmail } from "@/lib/email";
import { getT, translator } from "@/lib/i18n";
import { str, type FormState } from "@/server/form";

const CLAIM_LINK_DAYS = 60;
const MAX_CSV_BYTES = 3 * 1024 * 1024;

// Only paths under /admin/companies, so the hidden field can't redirect elsewhere.
function backTo(form: FormData, extra: Record<string, string>) {
  const back = str(form, "back");
  const url = new URL(back.startsWith("/admin/companies") ? back : "/admin/companies", "http://x");
  for (const key of ["link", "sent", "for"]) url.searchParams.delete(key);
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);
  return `${url.pathname}${url.search}`;
}

async function newClaimToken(companyId: string, verifies: boolean, invitedEmail?: string) {
  const token = randomBytes(32).toString("base64url");
  await db.company.update({
    where: { id: companyId },
    data: {
      claimTokenHash: sha256(token),
      claimTokenExpiresAt: new Date(Date.now() + CLAIM_LINK_DAYS * 24 * 60 * 60 * 1000),
      claimVerifies: verifies,
      ...(invitedEmail ? { invitedAt: new Date(), invitedEmail } : {}),
    },
  });
  return token;
}

async function claimableCompany(id: string) {
  const company = await db.company.findUnique({ where: { id } });
  return company && !company.claimedAt && !company.optedOutAt ? company : null;
}

/** Admin: makes a claim link to send by hand. It doesn't prove anything about the claimant. */
export async function createClaimLink(form: FormData) {
  await requireAdmin();
  const company = await claimableCompany(str(form, "companyId"));
  if (!company) redirect(backTo(form, {}));
  const token = await newClaimToken(company.id, false);
  redirect(backTo(form, { link: appUrl(`/claim/${token}`), for: company.id }));
}

/** Admin: emails a claim link to the address the firm filed in the register. Claiming it verifies the firm. */
export async function sendClaimInvite(form: FormData) {
  await requireAdmin();
  const company = await claimableCompany(str(form, "companyId"));
  if (!company?.email) redirect(backTo(form, {}));
  const token = await newClaimToken(company.id, true, company.email);
  const link = appUrl(`/claim/${token}`);
  // The firm's language is unknown, so the invitation is in Estonian with English below.
  const body = (["et", "en"] as const)
    .map((l) => {
      const t = translator(l);
      return [
        t("claim.emailHello"),
        t("claim.emailBody", { name: company.name }),
        link,
        t("claim.emailOptOut"),
        t("claim.emailSource"),
      ].join("\n\n");
    })
    .join("\n\n———\n\n");
  await sendEmail({
    to: company.email,
    subject: `${translator("et")("claim.emailSubject", { name: company.name })} / ${translator("en")("claim.emailSubject", { name: company.name })}`,
    text: body,
  });
  redirect(backTo(form, { sent: company.id }));
}

export async function importCompanyCsv(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const { t } = await getT();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: t("companies.importNoFile") };
  if (file.size > MAX_CSV_BYTES) return { error: t("companies.importTooBig") };
  const { rows, skipped } = parseCompanyCsv(await file.text());
  const written = await upsertCompanies(db, rows, "csv");
  revalidatePath("/admin/companies");
  return { ok: t("companies.imported", { count: written, skipped }) };
}

class ClaimTakenError extends Error {}

const claimSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CONTRACTOR", "SUBCONTRACTOR", "SPECIALIST"]),
});

export async function claimCompany(_prev: FormState, form: FormData): Promise<FormState> {
  const { t, locale } = await getT();
  const token = str(form, "token");
  const found = await lookupClaim(token);
  if (found.state !== "ok") return { error: t("claim.invalid") };
  const company = found.company;
  const current = await getCurrentUser();

  const userId = current?.id;
  let newUser: { email: string; role: "CONTRACTOR" | "SUBCONTRACTOR" | "SPECIALIST"; passwordHash: string } | undefined;
  if (current) {
    if (current.profile?.regCode && current.profile.regCode !== company.regCode) return { error: t("claim.otherCompany") };
    if (await db.company.findUnique({ where: { claimedById: current.id } })) return { error: t("claim.otherCompany") };
  } else {
    const parsed = claimSchema.safeParse({
      email: str(form, "email").toLowerCase(),
      password: str(form, "password"),
      role: str(form, "role"),
    });
    if (!parsed.success) return { error: t("auth.error.invalidSignup") };
    if (await db.user.findUnique({ where: { email: parsed.data.email } })) return { error: t("claim.emailTaken") };
    const { email, password, role } = parsed.data;
    newUser = { email, role, passwordHash: await hashPassword(password) };
  }

  // Prefill only what the profile doesn't have yet, so claiming never overwrites someone's own text.
  const existing = userId ? await db.profile.findUnique({ where: { userId }, include: { trades: true } }) : null;
  const prefill = {
    displayName: existing?.displayName || company.name,
    companyName: existing?.companyName || company.name,
    regCode: company.regCode,
    phone: existing?.phone || company.phone,
    website: existing?.website || company.website,
    country: existing?.country || company.country,
    serviceCountries: existing?.serviceCountries.length ? existing.serviceCountries : [company.country],
    verified: existing?.verified || company.claimVerifies,
  };
  const trades = existing?.trades.length ? undefined : { connect: company.tradeSlugs.map((slug) => ({ slug })) };

  const claimedBy = await db.$transaction(async (tx) => {
    const id = userId ?? (await tx.user.create({ data: { ...newUser!, locale } })).id;
    // Conditional update so two people can't claim the same link at once; throwing rolls back the new user.
    const { count } = await tx.company.updateMany({
      where: { id: company.id, claimTokenHash: company.claimTokenHash, claimedAt: null },
      data: { claimedAt: new Date(), claimedById: id, claimTokenHash: null, claimTokenExpiresAt: null },
    });
    if (count === 0) throw new ClaimTakenError();
    await tx.profile.upsert({
      where: { userId: id },
      create: { ...prefill, userId: id, trades },
      update: { ...prefill, ...(trades ? { trades } : {}) },
    });
    return id;
  }).catch((err) => {
    if (err instanceof ClaimTakenError) return null;
    throw err;
  });
  if (!claimedBy) return { error: t("claim.invalid") };

  if (!current) await createSession(claimedBy);
  revalidatePath("/", "layout");
  redirect("/profile/edit?claimed=1");
}

/** The firm asks not to be contacted: wipe contact details and keep the code so re-imports skip it. */
export async function optOutCompany(form: FormData) {
  const company = await companyForToken(str(form, "token"));
  if (company) {
    await db.company.update({ where: { id: company.id }, data: { ...SUPPRESSED_FIELDS, optedOutAt: new Date() } });
  }
  redirect("/claim/removed");
}
