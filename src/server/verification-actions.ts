"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { checkEeMtr, isValidEeRegCode, lookupEeCompany, normalizeRegCode } from "@/lib/registry";
import { str, type FormState } from "@/server/form";

/** Looks the code up in both registers and returns the Profile fields to store, or null if the company doesn't exist. */
async function registryCheck(regCode: string) {
  const [company, mtr] = await Promise.all([lookupEeCompany(regCode), checkEeMtr(regCode)]);
  if (!company) return null;
  return {
    active: company.status === "active",
    data: {
      registryName: company.name,
      registryStatus: company.status,
      registryAddress: company.address,
      registryCheckedAt: new Date(),
      mtrStatus: mtr.status,
      mtrActivities: mtr.activities,
      mtrUrl: mtr.url,
    },
  };
}

export async function verifyCompany(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const { t } = await getT();
  const profile = user.profile;
  if (!profile) return { error: t("verify.error.noProfile") };

  const regCode = normalizeRegCode(str(form, "regCode"));
  if (!isValidEeRegCode(regCode)) return { error: t("verify.error.invalid") };

  // A company can carry the badge on one account only.
  const taken = await db.profile.findFirst({ where: { regCode, verified: true, userId: { not: user.id } } });
  if (taken) return { error: t("verify.error.taken") };

  let result: Awaited<ReturnType<typeof registryCheck>>;
  try {
    result = await registryCheck(regCode);
  } catch {
    // Keep the code so an admin can verify by hand, and let the user retry later.
    await db.profile.update({ where: { userId: user.id }, data: { regCode, verified: false, verifiedAt: null, verifiedSource: null } });
    revalidatePath("/", "layout");
    return { error: t("verify.error.unreachable") };
  }
  if (!result) return { error: t("verify.error.notFound") };

  const verified = result.active;
  await db.profile.update({
    where: { userId: user.id },
    data: {
      ...result.data,
      regCode,
      companyName: profile.companyName || result.data.registryName,
      verified,
      verifiedAt: verified ? new Date() : null,
      verifiedSource: verified ? "registry" : null,
    },
  });
  revalidatePath("/", "layout");
  return verified ? { ok: t("verify.ok", { name: result.data.registryName }) } : { error: t("verify.error.inactive") };
}

/** Admin: refresh the register snapshot. A company that is no longer active loses its badge. */
export async function recheckCompany(form: FormData) {
  await requireAdmin();
  const userId = str(form, "userId");
  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile?.regCode || !isValidEeRegCode(profile.regCode)) return;
  const result = await registryCheck(profile.regCode).catch(() => undefined);
  if (result === undefined) return;
  const lost = !result?.active && profile.verifiedSource !== "admin";
  await db.profile.update({
    where: { userId },
    data: {
      ...(result?.data ?? { registryStatus: "not_found", registryCheckedAt: new Date() }),
      ...(lost ? { verified: false, verifiedAt: null, verifiedSource: null } : {}),
    },
  });
  revalidatePath("/admin");
}
