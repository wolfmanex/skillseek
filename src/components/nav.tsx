import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getT, LOCALES } from "@/lib/i18n";
import { logout, setLocale } from "@/server/auth-actions";
import { BackField } from "@/components/forms";

export async function Nav() {
  const user = await getCurrentUser();
  const { t, locale } = await getT();
  const unread = user
    ? await db.message.count({
        where: {
          readAt: null,
          senderId: { not: user.id },
          application: { OR: [{ applicantId: user.id }, { posting: { authorId: user.id } }] },
        },
      })
    : 0;

  const link = "rounded-md px-2 py-1 text-sm font-medium text-stone-200 hover:bg-stone-800 hover:text-white";

  return (
    <header className="bg-stone-900">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="mr-4 flex items-center gap-2 text-lg font-bold text-white">
          <span className="grid h-7 w-7 place-items-center rounded bg-amber-500 text-stone-950">S</span>
          Skillseek
        </Link>
        <Link href="/postings" className={link}>{t("nav.postings")}</Link>
        <Link href="/pros" className={link}>{t("nav.pros")}</Link>
        {user && (
          <>
            <Link href="/dashboard" className={link}>{t("nav.dashboard")}</Link>
            <Link href="/messages" className={link}>
              {t("nav.messages")}
              {unread > 0 && (
                <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs font-bold text-stone-950">{unread}</span>
              )}
            </Link>
            {user.isAdmin && <Link href="/admin" className={link}>{t("nav.admin")}</Link>}
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <form action={setLocale} className="flex overflow-hidden rounded-md border border-stone-700">
            <BackField />
            {LOCALES.map((l) => (
              <button
                key={l}
                name="locale"
                value={l}
                className={`px-2 py-1 text-xs font-semibold uppercase ${l === locale ? "bg-stone-700 text-white" : "text-stone-400 hover:text-white"}`}
              >
                {l}
              </button>
            ))}
          </form>
          {user ? (
            <>
              <Link href={user.profile ? `/pros/${user.id}` : "/profile/edit"} className={link}>
                {user.profile?.displayName ?? user.email}
              </Link>
              <form action={logout}>
                <button className={link}>{t("nav.logout")}</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={link}>{t("nav.login")}</Link>
              <Link href="/signup" className="rounded-md bg-amber-500 px-3 py-1 text-sm font-semibold text-stone-950 hover:bg-amber-400">
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
