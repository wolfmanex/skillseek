"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser, requireAdmin } from "@/lib/auth";
import { isCounty } from "@/lib/constants";
import { getT } from "@/lib/i18n";
import { list, lines, optDate, optInt, optStr, str, type FormState } from "@/server/form";

export async function saveProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const { t } = await getT();

  const displayName = str(form, "displayName");
  if (!displayName) return { error: t("profile.error.name") };

  const tradeSlugs = list(form, "trades");
  if (tradeSlugs.length === 0 && user.role !== "CONTRACTOR") return { error: t("profile.error.trades") };

  const county = str(form, "county");
  const website = optStr(form, "website");
  const portfolioUrls = lines(form, "portfolioUrls").filter((u) => /^https?:\/\//i.test(u));

  const data = {
    displayName,
    companyName: optStr(form, "companyName"),
    regCode: optStr(form, "regCode"),
    bio: str(form, "bio"),
    phone: optStr(form, "phone"),
    website: website && /^https?:\/\//i.test(website) ? website : website ? `https://${website}` : null,
    county: isCounty(county) ? county : null,
    serviceCounties: list(form, "serviceCounties").filter(isCounty),
    certifications: lines(form, "certifications"),
    portfolioUrls,
    yearsExperience: optInt(form, "yearsExperience"),
    hourlyRate: optInt(form, "hourlyRate"),
    available: form.get("available") === "on",
    availableFrom: optDate(form, "availableFrom"),
  };
  const trades = { set: tradeSlugs.map((slug) => ({ slug })) };

  await db.profile.upsert({
    where: { userId: user.id },
    create: { ...data, userId: user.id, trades: { connect: tradeSlugs.map((slug) => ({ slug })) } },
    update: { ...data, trades },
  });

  revalidatePath("/", "layout");
  redirect(`/pros/${user.id}`);
}

export async function toggleVerified(form: FormData) {
  await requireAdmin();
  const userId = str(form, "userId");
  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile) return;
  await db.profile.update({ where: { userId }, data: { verified: !profile.verified } });
  revalidatePath("/admin");
}
