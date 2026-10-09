import Link from "next/link";
import type { Profile, Role, Trade } from "@prisma/client";
import { countryName } from "@/lib/constants";
import { tradeName, type Locale, type T } from "@/lib/i18n";
import type { MatchResult } from "@/lib/matching";
import { Badge, Card, Stars } from "@/components/ui";

export function ProCard({
  profile,
  role,
  rating,
  match,
  t,
  locale,
  children,
}: {
  profile: Profile & { trades: Trade[] };
  role: Role;
  rating?: { avg: number; count: number };
  match?: MatchResult;
  t: T;
  locale: Locale;
  children?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/pros/${profile.userId}`} className="font-semibold hover:underline">
            {profile.companyName || profile.displayName}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-600">
            <Badge tone={role === "SPECIALIST" ? "blue" : "stone"}>{t(`role.${role}`)}</Badge>
            {profile.verified && <Badge tone="green">✓ {t("pro.verified")}</Badge>}
            {profile.country && <span>{countryName(profile.country, locale)}</span>}
          </div>
        </div>
        {match && (
          <div className="text-right">
            <div className="text-lg font-bold text-amber-600">{match.score}%</div>
            <div className="text-xs text-stone-500">{t("match.label")}</div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {profile.trades.slice(0, 5).map((tr) => (
          <Badge key={tr.id} tone="amber">{tradeName(tr, locale)}</Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
        {rating && rating.count > 0 ? (
          <span><Stars value={rating.avg} /> ({rating.count})</span>
        ) : (
          <span>{t("pro.noReviews")}</span>
        )}
        <span className={profile.available ? "text-green-700" : "text-stone-500"}>
          {profile.available ? t("pro.available") : t("pro.unavailable")}
        </span>
      </div>
      {match && (
        <div className="flex flex-wrap gap-1">
          {match.reasons.map((r) => (
            <span key={r} className="text-xs text-stone-500">✓ {t(`match.reason.${r}`)}</span>
          ))}
        </div>
      )}
      {children}
    </Card>
  );
}
