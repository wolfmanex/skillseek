import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ACTIVE_STATUS, ARIREGISTER_ATTRIBUTION } from "@/lib/company-import";
import { formatDate, getT, sortTrades, tradeName } from "@/lib/i18n";
import { createClaimLink, importCompanyCsv, sendClaimInvite } from "@/server/company-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Badge, Card, Empty, PageHeader, btnCls, btnSecondaryCls, inputCls } from "@/components/ui";

const PAGE_SIZE = 50;
const STATES = ["unclaimed", "invited", "claimed", "optedOut", "all"] as const;
type State = (typeof STATES)[number];

const STATE_WHERE: Record<State, Prisma.CompanyWhereInput> = {
  unclaimed: { claimedAt: null, optedOutAt: null, invitedAt: null },
  invited: { claimedAt: null, optedOutAt: null, invitedAt: { not: null } },
  claimed: { claimedAt: { not: null } },
  optedOut: { optedOutAt: { not: null } },
  all: {},
};

export default async function AdminCompaniesPage({ searchParams }: PageProps<"/admin/companies">) {
  await requireAdmin();
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const { t, locale } = await getT();

  const q = one("q");
  const trade = one("trade");
  const county = one("county");
  const withEmail = one("email") === "1";
  const state: State = (STATES as readonly string[]).includes(one("state")) ? (one("state") as State) : "unclaimed";
  const page = Math.max(1, Number.parseInt(one("page") || "1", 10) || 1);

  const where: Prisma.CompanyWhereInput = { ...STATE_WHERE[state] };
  if (state !== "claimed" && state !== "optedOut" && state !== "all") where.status = ACTIVE_STATUS;
  if (trade) where.tradeSlugs = { has: trade };
  if (county) where.county = county;
  if (withEmail) where.email = { not: null };
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { regCode: { startsWith: q.replace(/\s/g, "") } }];

  const [companies, total, counts, trades, counties] = await Promise.all([
    db.company.findMany({ where, orderBy: { name: "asc" }, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    db.company.count({ where }),
    Promise.all(STATES.map((s) => db.company.count({ where: STATE_WHERE[s] }))),
    db.trade.findMany(),
    db.company.groupBy({ by: ["county"], where: { county: { not: null } }, orderBy: { county: "asc" } }),
  ]);
  const tradeNames = new Map(trades.map((tr) => [tr.slug, tradeName(tr, locale)]));

  const qs = (extra: Record<string, string | number>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, trade, county, state, email: withEmail ? "1" : "", page, ...extra })) {
      if (v !== "" && !(k === "page" && v === 1)) p.set(k, String(v));
    }
    const s = p.toString();
    return `/admin/companies${s ? `?${s}` : ""}`;
  };
  const back = qs({});
  const link = one("link");
  const sent = one("sent");
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("companies.title")}
        subtitle={t("companies.subtitle")}
        action={<Link href="/admin" className={btnSecondaryCls}>{t("nav.admin")}</Link>}
      />

      {link && (
        <Card className="space-y-2 border-amber-300 bg-amber-50">
          <p className="text-sm font-medium">{t("companies.linkReady")}</p>
          <input readOnly value={link} className={`${inputCls} font-mono text-xs`} />
          <p className="text-xs text-stone-600">{t("companies.linkHint")}</p>
        </Card>
      )}
      {sent && <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{t("companies.inviteSent")}</p>}

      <nav className="flex flex-wrap gap-2 text-sm">
        {STATES.map((s, i) => (
          <Link
            key={s}
            href={qs({ state: s, page: 1 })}
            className={`rounded-full border px-3 py-1 ${s === state ? "border-amber-500 bg-amber-50 font-semibold" : "border-stone-200 bg-white"}`}
          >
            {t(`companies.state.${s}`)} · {counts[i]}
          </Link>
        ))}
      </nav>

      <form className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto]">
        <input type="hidden" name="state" value={state} />
        <input name="q" defaultValue={q} placeholder={t("companies.search")} className={inputCls} />
        <select name="trade" defaultValue={trade} className={inputCls}>
          <option value="">{t("filter.allTrades")}</option>
          {sortTrades(trades, locale).map((tr) => <option key={tr.slug} value={tr.slug}>{tradeName(tr, locale)}</option>)}
        </select>
        <select name="county" defaultValue={county} className={inputCls}>
          <option value="">{t("companies.allCounties")}</option>
          {counties.map((c) => c.county && <option key={c.county} value={c.county}>{c.county}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="email" value="1" defaultChecked={withEmail} className="accent-amber-500" />
          {t("companies.withEmail")}
        </label>
        <button className={btnCls}>{t("common.filter")}</button>
      </form>

      {companies.length === 0 ? (
        <Empty>{t("companies.empty")}</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase text-stone-600">
              <tr>
                <th className="px-4 py-2">{t("companies.company")}</th>
                <th className="px-4 py-2">{t("companies.trades")}</th>
                <th className="px-4 py-2">{t("companies.contact")}</th>
                <th className="px-4 py-2">{t("companies.status")}</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {companies.map((c) => {
                const open = !c.claimedAt && !c.optedOutAt;
                return (
                  <tr key={c.id} className={c.id === one("for") || c.id === sent ? "bg-amber-50" : undefined}>
                    <td className="px-4 py-2 align-top">
                      <a href={`https://ariregister.rik.ee/est/company/${c.regCode}`} target="_blank" rel="noreferrer" className="font-medium underline">
                        {c.name}
                      </a>
                      <div className="text-xs text-stone-500">{c.regCode} · {c.city ?? c.county ?? "—"}</div>
                    </td>
                    <td className="px-4 py-2 align-top">
                      <div className="flex flex-wrap gap-1">
                        {c.tradeSlugs.map((s) => <Badge key={s}>{tradeNames.get(s) ?? s}</Badge>)}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top text-xs">
                      {c.email && <div>{c.email}</div>}
                      {c.phone && <div>{c.phone}</div>}
                      {c.website && <div className="truncate">{c.website}</div>}
                    </td>
                    <td className="px-4 py-2 align-top text-xs">
                      {c.claimedAt ? (
                        <Link href={c.claimedById ? `/pros/${c.claimedById}` : "#"}>
                          <Badge tone="green">{t("companies.claimedOn", { date: formatDate(c.claimedAt, locale) })}</Badge>
                        </Link>
                      ) : c.optedOutAt ? (
                        <Badge tone="red">{t("companies.state.optedOut")}</Badge>
                      ) : c.invitedAt ? (
                        <Badge tone="blue">{t("companies.invitedOn", { date: formatDate(c.invitedAt, locale) })}</Badge>
                      ) : null}
                      {c.status !== ACTIVE_STATUS && <Badge tone="red">{t(c.status === "L" ? "companies.liquidation" : "companies.bankrupt")}</Badge>}
                    </td>
                    <td className="space-y-1 px-4 py-2 text-right align-top">
                      {open && c.status === ACTIVE_STATUS && (
                        <>
                          {c.email && (
                            <form action={sendClaimInvite}>
                              <input type="hidden" name="companyId" value={c.id} />
                              <input type="hidden" name="back" value={back} />
                              <SubmitButton className="text-xs font-medium text-amber-700 underline">
                                {c.invitedAt ? t("companies.resend") : t("companies.invite")}
                              </SubmitButton>
                            </form>
                          )}
                          <form action={createClaimLink}>
                            <input type="hidden" name="companyId" value={c.id} />
                            <input type="hidden" name="back" value={back} />
                            <SubmitButton className="text-xs underline">{t("companies.copyLink")}</SubmitButton>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={qs({ page: page - 1 })} className="underline">←</Link> : <span />}
          <span className="text-stone-500">{t("companies.page", { page, pages, total })}</span>
          {page < pages ? <Link href={qs({ page: page + 1 })} className="underline">→</Link> : <span />}
        </div>
      )}

      <Card className="space-y-3">
        <h2 className="font-semibold">{t("companies.importTitle")}</h2>
        <p className="text-sm text-stone-600">{t("companies.importBulk")}</p>
        <p className="text-sm text-stone-600">{t("companies.importCsv")}</p>
        <code className="block rounded bg-stone-100 px-2 py-1 text-xs">reg_code;name;email;phone;website;address;county;city;emtak;trades</code>
        <ActionForm action={importCompanyCsv} className="flex flex-wrap items-center gap-3">
          <input type="file" name="file" accept=".csv,text/csv" required className="text-sm" />
          <SubmitButton className={btnSecondaryCls}>{t("companies.importButton")}</SubmitButton>
        </ActionForm>
        <p className="text-xs text-stone-500">{ARIREGISTER_ATTRIBUTION}</p>
      </Card>
    </div>
  );
}
