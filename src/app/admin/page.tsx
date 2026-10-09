import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate, getT } from "@/lib/i18n";
import { toggleVerified } from "@/server/profile-actions";
import { Badge, Card, PageHeader } from "@/components/ui";

export default async function AdminPage() {
  await requireAdmin();
  const { t, locale } = await getT();
  const [users, postings, applications] = await Promise.all([
    db.user.findMany({ include: { profile: true }, orderBy: { createdAt: "desc" }, take: 200 }),
    db.posting.count(),
    db.application.count(),
  ]);

  return (
    <div>
      <PageHeader title={t("nav.admin")} subtitle={t("admin.stats", { users: users.length, postings, applications })} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase text-stone-600">
            <tr>
              <th className="px-4 py-2">{t("admin.user")}</th>
              <th className="px-4 py-2">{t("admin.role")}</th>
              <th className="px-4 py-2">{t("profile.regCode")}</th>
              <th className="px-4 py-2">{t("admin.joined")}</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2">
                  {u.profile ? (
                    <Link href={`/pros/${u.id}`} className="font-medium underline">{u.profile.companyName || u.profile.displayName}</Link>
                  ) : (
                    <span className="text-stone-500">{t("admin.noProfile")}</span>
                  )}
                  <div className="text-xs text-stone-500">{u.email}</div>
                </td>
                <td className="px-4 py-2">{t(`role.${u.role}`)}</td>
                <td className="px-4 py-2">{u.profile?.regCode ?? "—"}</td>
                <td className="px-4 py-2">{formatDate(u.createdAt, locale)}</td>
                <td className="px-4 py-2 text-right">
                  {u.profile && (
                    <form action={toggleVerified} className="inline">
                      <input type="hidden" name="userId" value={u.id} />
                      <button className="text-xs underline">
                        {u.profile.verified ? <Badge tone="green">✓ {t("admin.unverify")}</Badge> : t("admin.verify")}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
