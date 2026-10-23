"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { TRADES, WAITLIST_REGIONS } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import { getT } from "@/lib/i18n";
import { list, optStr, str, type FormState } from "@/server/form";

const TRADE_SLUGS = new Set(TRADES.map((t) => t.slug));

const waitlistSchema = z.object({
  email: z.string().email().max(200),
  role: z.enum(["CONTRACTOR", "SUBCONTRACTOR", "SPECIALIST"]),
  name: z.string().min(1).max(120),
  region: z.enum(WAITLIST_REGIONS),
});

export async function joinWaitlist(_prev: FormState, form: FormData): Promise<FormState> {
  const { t, locale } = await getT();

  // Honeypot: real people never see or fill this field. Pretend it worked so bots don't retry.
  if (str(form, "website")) return { ok: t("waitlist.thanks") };

  const parsed = waitlistSchema.safeParse({
    email: str(form, "email").toLowerCase(),
    role: str(form, "role"),
    name: str(form, "name"),
    region: str(form, "region"),
  });
  if (!parsed.success) return { error: t("waitlist.error.invalid") };
  if (str(form, "consent") !== "on") return { error: t("waitlist.error.consent") };

  const trades = list(form, "trades").filter((s) => TRADE_SLUGS.has(s));
  if (parsed.data.role !== "CONTRACTOR" && trades.length === 0) return { error: t("profile.error.trades") };

  const data = {
    ...parsed.data,
    companyName: optStr(form, "companyName")?.slice(0, 200) ?? null,
    regCode: optStr(form, "regCode")?.slice(0, 40) ?? null,
    phone: optStr(form, "phone")?.slice(0, 40) ?? null,
    trades,
    message: str(form, "message").slice(0, 2000),
    locale,
    source: optStr(form, "source")?.slice(0, 100) ?? null,
  };
  // Signing up again updates the entry, so people can correct their details.
  const existing = await db.waitlistEntry.findUnique({ where: { email: data.email }, select: { id: true } });
  await db.waitlistEntry.upsert({ where: { email: data.email }, create: data, update: data });

  if (!existing) {
    await sendEmail({
      to: data.email,
      subject: t("waitlist.emailSubject"),
      text: `${t("waitlist.emailHello", { name: data.name })}\n\n${t("waitlist.emailBody")}\n\n${t("waitlist.emailSign")}`,
    });
    const notify = process.env.WAITLIST_NOTIFY_EMAIL;
    if (notify) {
      await sendEmail({
        to: notify,
        subject: `[Skillseek waitlist] ${data.companyName ?? data.name} (${data.role}, ${data.region})`,
        text: [
          `${data.name} <${data.email}>${data.phone ? `, ${data.phone}` : ""}`,
          `Company: ${data.companyName ?? "-"} (${data.regCode ?? "no registry code"})`,
          `Trades: ${data.trades.join(", ") || "-"}`,
          `Language: ${data.locale}${data.source ? `, source: ${data.source}` : ""}`,
          data.message,
        ].join("\n"),
      });
    }
  }
  return { ok: t("waitlist.thanks") };
}

export async function toggleInvited(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  const entry = await db.waitlistEntry.findUnique({ where: { id } });
  if (!entry) return;
  await db.waitlistEntry.update({ where: { id }, data: { invitedAt: entry.invitedAt ? null : new Date() } });
  revalidatePath("/admin/waitlist");
}
