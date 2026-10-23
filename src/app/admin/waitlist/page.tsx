import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { TRADES } from "@/lib/constants";
import { formatDate, getT, tradeName } from "@/lib/i18n";
import { toggleInvited } from "@/server/waitlist-actions";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";

const TRADE_BY_SLUG = new Map(TRADES.map((t) => [t.slug, t]));

export default async function WaitlistAdminPage() {
  await requireAdmin();
  const { t, locale } = await getT();
  const entries = await db.waitlistEntry.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  const invited = entries.filter((e) => e.invitedAt).length;

  return (
    <div>
      <PageHeader
        title={t("admin.waitlist")}
        subtitle={t("admin.waitlistStats", { count: entries.length, invited })}
        action={<ButtonLink href="/admin/waitlist/export" prefetch={false} secondary>{t("admin.exportCsv")}</ButtonLink>}
      />
      {entries.length === 0 ? (
        <Empty>—</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase text-stone-600">
              <tr>
                <th className="px-4 py-2">{t("admin.user")}</th>
                <th className="px-4 py-2">{t("admin.role")}</th>
                <th className="px-4 py-2">{t("admin.region")}</th>
                <th className="px-4 py-2">{t("admin.trades")}</th>
                <th className="px-4 py-2">{t("admin.joined")}</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {entries.map((e) => (
                <tr key={e.id} className="align-top">
                  <td className="px-4 py-2">
                    <div className="font-medium">{e.companyName ?? e.name}</div>
                    <div className="text-xs text-stone-500">
                      {e.companyName && `${e.name} · `}
                      {e.email}
                      {e.phone && ` · ${e.phone}`}
                    </div>
                    {e.regCode && <div className="text-xs text-stone-500">{t("profile.regCode")}: {e.regCode}</div>}
                    {e.message && <p className="mt-1 max-w-sm whitespace-pre-line text-xs text-stone-600">{e.message}</p>}
                  </td>
                  <td className="px-4 py-2">{t(`role.${e.role}`)}</td>
                  <td className="px-4 py-2">{t(`waitlist.region.${e.region as "harju"}`)}</td>
                  <td className="px-4 py-2 text-xs">
                    {e.trades.map((s) => (TRADE_BY_SLUG.has(s) ? tradeName(TRADE_BY_SLUG.get(s)!, locale) : s)).join(", ")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatDate(e.createdAt, locale)}
                    <div className="text-xs uppercase text-stone-500">{e.locale}{e.source && ` · ${e.source}`}</div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <form action={toggleInvited} className="inline">
                      <input type="hidden" name="id" value={e.id} />
                      <button className="text-xs whitespace-nowrap underline">
                        {e.invitedAt ? <Badge tone="green">✓ {t("admin.invited")}</Badge> : t("admin.invite")}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
