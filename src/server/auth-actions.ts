"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  consumeLoginToken,
  createLoginToken,
  createSession,
  destroySession,
  hashPassword,
  requireUser,
  sessionIsFresh,
  verifyPassword,
} from "@/lib/auth";
import { appUrl, sendEmail } from "@/lib/email";
import { getT, isLocale, LOCALE_COOKIE, translator } from "@/lib/i18n";
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

export async function requestLoginLink(_prev: FormState, form: FormData): Promise<FormState> {
  const { t } = await getT();
  const email = str(form, "email").toLowerCase();
  if (!z.string().email().safeParse(email).success) return { error: t("auth.error.email") };

  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const token = await createLoginToken(user.id);
    const ut = translator(isLocale(user.locale) ? user.locale : "en");
    await sendEmail({
      to: user.email,
      subject: ut("email.loginSubject"),
      text: `${ut("email.loginBody")}\n\n${appUrl(`/auth/verify?token=${token}`)}\n\n${ut("email.loginIgnore")}`,
    });
  }
  // Same answer whether or not the account exists, so the form can't be used to probe emails.
  return { ok: t("auth.linkSent") };
}

export async function signInWithLink(form: FormData) {
  const userId = await consumeLoginToken(str(form, "token"));
  if (!userId) redirect("/auth/verify?error=1");
  await createSession(userId);
  redirect("/dashboard");
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const { t } = await getT();
  const next = str(form, "newPassword");
  if (next.length < 8) return { error: t("auth.passwordHint") };
  // A fresh session (just signed in, e.g. by email link) may set a password without the old one.
  const current = str(form, "currentPassword");
  if (!(await sessionIsFresh()) && !(await verifyPassword(current, user.passwordHash))) {
    return { error: t("account.error.current") };
  }
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  return { ok: t("account.saved") };
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
