import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SESSION_COOKIE = "ss_session";
const SESSION_DAYS = 30;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const id = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { id, userId, expiresAt } });
  const store = await cookies();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) await db.session.deleteMany({ where: { id } });
  store.delete(SESSION_COOKIE);
}

// Cached per request so layouts and pages can both call it cheaply.
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const session = await db.session.findUnique({
    where: { id },
    include: { user: { include: { profile: { include: { trades: true } } } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Most of the app needs a profile; send new accounts to fill one in first.
export async function requireProfile() {
  const user = await requireUser();
  if (!user.profile) redirect("/profile/edit");
  return user as CurrentUser & { profile: NonNullable<CurrentUser["profile"]> };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/dashboard");
  return user;
}
