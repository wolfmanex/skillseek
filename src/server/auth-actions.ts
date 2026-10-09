"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { getT, isLocale, LOCALE_COOKIE } from "@/lib/i18n";
import { str, type FormState } from "@/server/form";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CONTRACTOR", "SUBCONTRACTOR", "SPECIALIST"]),
});

export async function signup(_prev: FormState, form: FormData): Promise<FormState> {
  const { t, locale } = await getT();
  const parsed = signupSchema.safeParse({
    email: str(form, "email").toLowerCase(),
    password: str(form, "password"),
    role: str(form, "role"),
  });
  if (!parsed.success) return { error: t("auth.error.invalidSignup") };
  const { email, password, role } = parsed.data;

  if (await db.user.findUnique({ where: { email } })) return { error: t("auth.error.emailTaken") };

  const user = await db.user.create({
    data: { email, role, locale, passwordHash: await hashPassword(password) },
  });
  await createSession(user.id);
  redirect("/profile/edit");
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const { t } = await getT();
  const email = str(form, "email").toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(str(form, "password"), user.passwordHash))) {
    return { error: t("auth.error.badLogin") };
  }
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function setLocale(form: FormData) {
  const locale = str(form, "locale");
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  const back = str(form, "back");
  redirect(back.startsWith("/") ? back : "/");
}
