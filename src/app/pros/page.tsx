import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getT, tradeName } from "@/lib/i18n";
import { isCounty } from "@/lib/constants";
import { ratingsFor } from "@/server/queries";
import { CountySelect } from "@/components/pickers";
import { ProCard } from "@/components/pro-card";
import { Empty, PageHeader, btnCls, inputCls } from "@/components/ui";

export default async function ProsPage({ searchParams }: PageProps<"/pros">) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const { t, locale } = await getT();
  const trades = await db.trade.findMany({ orderBy: { nameEn: "asc" } });

  const trade = one("trade");
  const county = one("county");
  const role = one("role");
  const q = one("q");
  const available = one("available") === "1";

  const where: Prisma.ProfileWhereInput = {
    user: { role: role === "SUBCONTRACTOR" || role === "SPECIALIST" ? role : { not: "CONTRACTOR" } },
  };
  if (trade) where.trades = { some: { slug: trade } };
  if (isCounty(county)) where.OR = [{ county }, { serviceCounties: { has: county } }];
  if (available) where.available = true;
  if (q) {
    where.AND = [
      {
        OR: [
          { displayName: { contains: q, mode: "insensitive" } },
          { companyName: { contains: q, mode: "insensitive" } },
          { bio: { contains: q, mode: "insensitive" } },
        ],
      },
    ];
  }

  const profiles = await db.profile.findMany({
    where,
    include: { trades: true, user: { select: { role: true } } },
    orderBy: [{ verified: "desc" }, { updatedAt: "desc" }],
    take: 60,
  });
  const ratings = await ratingsFor(profiles.map((p) => p.userId));

  return (
    <div>
      <PageHeader title={t("pros.title")} subtitle={t("pros.subtitle")} />
      <form className="mb-6 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input name="q" defaultValue={q} placeholder={t("common.search")} className={`${inputCls} lg:col-span-2`} />
        <select name="trade" defaultValue={trade} className={inputCls}>
          <option value="">{t("filter.allTrades")}</option>
          {trades.map((tr) => (
            <option key={tr.slug} value={tr.slug}>{tradeName(tr, locale)}</option>
          ))}
        </select>
        <CountySelect name="county" value={county} placeholder={t("filter.allCounties")} />
        <select name="role" defaultValue={role} className={inputCls}>
          <option value="">{t("filter.allPros")}</option>
          <option value="SUBCONTRACTOR">{t("role.SUBCONTRACTOR")}</option>
          <option value="SPECIALIST">{t("role.SPECIALIST")}</option>
        </select>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" name="available" value="1" defaultChecked={available} className="accent-amber-500" />
            {t("filter.availableOnly")}
          </label>
          <button className={btnCls}>{t("common.filter")}</button>
        </div>
      </form>
      {profiles.length === 0 ? (
        <Empty>{t("pros.empty")}</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProCard key={p.id} profile={p} role={p.user.role} rating={ratings.get(p.userId)} t={t} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
