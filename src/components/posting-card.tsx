import Link from "next/link";
import type { Posting, Profile, Trade } from "@prisma/client";
import { countyName } from "@/lib/constants";
import { formatDate, formatEuro, tradeName, type Locale, type T } from "@/lib/i18n";
import type { MatchResult } from "@/lib/matching";
import { Badge, Card } from "@/components/ui";

export function budgetText(p: Pick<Posting, "budgetMin" | "budgetMax">, locale: Locale, t: T) {
  if (p.budgetMin != null && p.budgetMax != null) return `${formatEuro(p.budgetMin, locale)} – ${formatEuro(p.budgetMax, locale)}`;
  if (p.budgetMin != null) return `${t("posting.from")} ${formatEuro(p.budgetMin, locale)}`;
  if (p.budgetMax != null) return `${t("posting.upTo")} ${formatEuro(p.budgetMax, locale)}`;
  return t("posting.budgetOpen");
}

export function statusTone(status: Posting["status"]) {
  return ({ OPEN: "green", IN_PROGRESS: "blue", COMPLETED: "stone", CLOSED: "red" } as const)[status];
}

export function PostingCard({
  posting,
  t,
  locale,
  match,
  extra,
}: {
  posting: Posting & { trades: Trade[]; author: { profile: Profile | null } };
  t: T;
  locale: Locale;
  match?: MatchResult;
  extra?: React.ReactNode;
}) {
  const author = posting.author.profile;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/postings/${posting.id}`} className="font-semibold hover:underline">{posting.title}</Link>
          <p className="mt-1 text-xs text-stone-600">
            {author?.companyName || author?.displayName} · {countyName(posting.county)}
            {posting.city ? `, ${posting.city}` : ""}
          </p>
        </div>
        {match ? (
          <div className="text-right">
            <div className="text-lg font-bold text-amber-600">{match.score}%</div>
            <div className="text-xs text-stone-500">{t("match.label")}</div>
          </div>
        ) : (
          <Badge tone={statusTone(posting.status)}>{t(`status.${posting.status}`)}</Badge>
        )}
      </div>
      <p className="line-clamp-2 text-sm text-stone-700">{posting.description}</p>
      <div className="flex flex-wrap gap-1">
        {posting.trades.map((tr) => <Badge key={tr.id} tone="amber">{tradeName(tr, locale)}</Badge>)}
        <Badge>{t(`seeking.${posting.seeking}`)}</Badge>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
        <span>{budgetText(posting, locale, t)}</span>
        {posting.startDate && <span>{t("posting.starts")} {formatDate(posting.startDate, locale)}</span>}
      </div>
      {extra}
    </Card>
  );
}
