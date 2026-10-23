import type { Profile } from "@prisma/client";
import { formatDate, type Locale, type T } from "@/lib/i18n";
import { MTR_SEARCH_URL, companyUrl } from "@/lib/registry";
import { Badge } from "@/components/ui";

/** The "Verified" badge, with a tooltip saying where the check came from. */
export function VerifiedBadge({ profile, t, locale }: { profile: Profile; t: T; locale: Locale }) {
  if (!profile.verified) return null;
  const title =
    profile.verifiedSource === "registry" || profile.verifiedSource === "claim"
      ? t("verify.badgeTitle", { date: formatDate(profile.verifiedAt ?? profile.updatedAt, locale) })
      : undefined;
  return (
    <span title={title}>
      <Badge tone="green">✓ {t("pro.verified")}</Badge>
    </span>
  );
}

const STATUS_TONE: Record<string, "green" | "amber" | "red" | "stone"> = {
  active: "green",
  liquidation: "amber",
  bankrupt: "red",
  deleted: "red",
  not_found: "red",
};
// Not every trade has to register in MTR, so a missing entry is a caution, not a failure.
const MTR_TONE: Record<string, "green" | "amber" | "stone"> = { registered: "green", not_found: "amber" };

const statusKey = (s: string) => `verify.status.${s}` as Parameters<T>[0];

/** Register facts for a profile page or the admin table; renders nothing until a check has run. */
export function RegistryFacts({ profile, t, locale, compact }: { profile: Profile; t: T; locale: Locale; compact?: boolean }) {
  if (!profile.registryCheckedAt || !profile.regCode) return null;
  const reg = profile.registryStatus ?? "unknown";
  const mtr = profile.mtrStatus ?? "unknown";
  return (
    <div className={compact ? "space-y-1 text-xs" : "space-y-2 text-sm"}>
      <div className="flex flex-wrap items-center gap-2">
        <a href={companyUrl(profile.regCode)} target="_blank" rel="noopener noreferrer" className="underline">
          {t("verify.businessRegister")}
        </a>
        <Badge tone={STATUS_TONE[reg] ?? "stone"}>{t(statusKey(reg))}</Badge>
        {!compact && profile.registryName && <span className="text-stone-700">{profile.registryName}</span>}
      </div>
      {!compact && profile.registryAddress && <div className="text-stone-600">{profile.registryAddress}</div>}
      <div className="flex flex-wrap items-center gap-2">
        <a href={profile.mtrUrl ?? MTR_SEARCH_URL} target="_blank" rel="noopener noreferrer" className="underline">
          {t("verify.mtr")}
        </a>
        <Badge tone={MTR_TONE[mtr] ?? "stone"}>{t(statusKey(`mtr_${mtr}`))}</Badge>
      </div>
      {!compact && profile.mtrActivities.length > 0 && (
        <ul className="list-inside list-disc text-stone-600">
          {profile.mtrActivities.map((a) => <li key={a}>{a}</li>)}
        </ul>
      )}
      <div className="text-xs text-stone-500">{t("verify.checkedAt", { date: formatDate(profile.registryCheckedAt, locale) })}</div>
    </div>
  );
}
