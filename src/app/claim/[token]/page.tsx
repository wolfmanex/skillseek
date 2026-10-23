import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { lookupClaim } from "@/lib/claims";
import { countryName } from "@/lib/constants";
import { getT, sortTrades, tradeName } from "@/lib/i18n";
import { claimCompany, optOutCompany } from "@/server/company-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Badge, Card, Field, btnCls, btnSecondaryCls, inputCls } from "@/components/ui";

const ROLES = ["SUBCONTRACTOR", "CONTRACTOR", "SPECIALIST"] as const;

// Opening the page changes nothing; claiming and opting out are both explicit button presses,
// so email scanners that pre-open links can't act on them.
export default async function ClaimPage({ params }: PageProps<"/claim/[token]">) {
  const { token } = await params;
  const { t, locale } = await getT();
  const found = await lookupClaim(token);

  if (found.state === "invalid") {
    return (
      <div className="mx-auto max-w-md">
        <Card className="space-y-3 text-center">
          <p className="text-sm text-stone-700">{t("claim.invalid")}</p>
          <Link href="/" className="text-sm font-medium text-amber-700 underline">{t("notFound.home")}</Link>
        </Card>
      </div>
    );
  }

  const company = found.company;
  const user = await getCurrentUser();
  const trades = sortTrades(await db.trade.findMany({ where: { slug: { in: company.tradeSlugs } } }), locale);
  const details: [string, string | null][] = [
    [t("profile.regCode"), company.regCode],
    [t("claim.address"), company.address ?? countryName(company.country, locale)],
    [t("auth.email"), company.email],
    [t("profile.phone"), company.phone],
    [t("profile.website"), company.website],
  ];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("claim.title", { name: company.name })}</h1>
        <p className="mt-1 text-sm text-stone-600">{t("claim.intro")}</p>
      </div>

      <Card className="space-y-3">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {details
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-stone-500">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
        </dl>
        {trades.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {trades.map((tr) => <Badge key={tr.slug} tone="amber">{tradeName(tr, locale)}</Badge>)}
          </div>
        )}
        <p className="text-xs text-stone-500">{t("claim.source")}</p>
      </Card>

      {found.state === "expired" ? (
        <Card><p className="text-sm text-stone-700">{t("claim.expired")}</p></Card>
      ) : (
        <Card>
          <ActionForm action={claimCompany}>
            <input type="hidden" name="token" value={token} />
            {user ? (
              <p className="text-sm text-stone-700">{t("claim.asUser", { email: user.email })}</p>
            ) : (
              <>
                <fieldset className="space-y-2">
                  <legend className="mb-1 text-sm font-medium">{t("auth.iAm")}</legend>
                  {ROLES.map((role, i) => (
                    <label key={role} className="flex cursor-pointer gap-3 rounded-md border border-stone-200 p-3 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                      <input type="radio" name="role" value={role} defaultChecked={i === 0} className="mt-1 accent-amber-500" />
                      <span>
                        <span className="block text-sm font-semibold">{t(`role.${role}`)}</span>
                        <span className="block text-xs text-stone-600">{t(`role.${role}.desc`)}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
                <Field label={t("auth.email")}>
                  <input name="email" type="email" required autoComplete="email" defaultValue={company.invitedEmail ?? company.email ?? ""} className={inputCls} />
                </Field>
                <Field label={t("auth.password")} hint={t("auth.passwordHint")}>
                  <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
                </Field>
              </>
            )}
            <SubmitButton className={`${btnCls} w-full`}>{t("claim.submit")}</SubmitButton>
            {!user && (
              <p className="text-center text-xs text-stone-500">
                {t("auth.haveAccount")} <Link href="/login" className="underline">{t("nav.login")}</Link> · {t("claim.loginHint")}
              </p>
            )}
          </ActionForm>
        </Card>
      )}

      <Card className="space-y-3">
        <h2 className="font-semibold">{t("claim.optOutTitle")}</h2>
        <p className="text-sm text-stone-600">{t("claim.optOutBody")}</p>
        <form action={optOutCompany}>
          <input type="hidden" name="token" value={token} />
          <SubmitButton className={btnSecondaryCls}>{t("claim.optOut")}</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
