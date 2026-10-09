import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isCounty } from "@/lib/constants";
import { canPost } from "@/lib/matching";
import { getT, tradeName } from "@/lib/i18n";
import { CountySelect } from "@/components/pickers";
import { PostingCard } from "@/components/posting-card";
import { ButtonLink, Empty, PageHeader, btnCls, inputCls } from "@/components/ui";

export default async function PostingsPage({ searchParams }: PageProps<"/postings">) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const { t, locale } = await getT();
  const user = await getCurrentUser();
  const trades = await db.trade.findMany({ orderBy: { nameEn: "asc" } });

  const trade = one("trade");
  const county = one("county");
  const seeking = one("seeking");
  const q = one("q");

  const where: Prisma.PostingWhereInput = { status: "OPEN" };
  if (trade) where.trades = { some: { slug: trade } };
  if (isCounty(county)) where.county = county;
  if (seeking === "SUBCONTRACTOR" || seeking === "SPECIALIST") where.seeking = { in: [seeking, "ANY"] };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const postings = await db.posting.findMany({
    where,
    include: { trades: true, author: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div>
      <PageHeader
        title={t("postings.title")}
        subtitle={t("postings.subtitle")}
        action={user && canPost(user.role) ? <ButtonLink href="/postings/new">{t("postings.new")}</ButtonLink> : undefined}
      />
      <form className="mb-6 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input name="q" defaultValue={q} placeholder={t("common.search")} className={inputCls} />
        <select name="trade" defaultValue={trade} className={inputCls}>
          <option value="">{t("filter.allTrades")}</option>
          {trades.map((tr) => <option key={tr.slug} value={tr.slug}>{tradeName(tr, locale)}</option>)}
        </select>
        <CountySelect name="county" value={county} placeholder={t("filter.allCounties")} />
        <select name="seeking" defaultValue={seeking} className={inputCls}>
          <option value="">{t("filter.anyone")}</option>
          <option value="SUBCONTRACTOR">{t("seeking.SUBCONTRACTOR")}</option>
          <option value="SPECIALIST">{t("seeking.SPECIALIST")}</option>
        </select>
        <button className={btnCls}>{t("common.filter")}</button>
      </form>
      {postings.length === 0 ? (
        <Empty>{t("postings.empty")}</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {postings.map((p) => <PostingCard key={p.id} posting={p} t={t} locale={locale} />)}
        </div>
      )}
    </div>
  );
}
