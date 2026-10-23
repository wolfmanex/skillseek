import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { TRADES, WAITLIST_REGIONS } from "@/lib/constants";
import { getT, type T } from "@/lib/i18n";
import { joinWaitlist } from "@/server/waitlist-actions";
import { OneShotForm } from "@/components/forms";
import { TradeCheckboxes } from "@/components/pickers";
import { btnCls, Card, Field, inputCls } from "@/components/ui";

const ROLES = ["CONTRACTOR", "SUBCONTRACTOR", "SPECIALIST"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("landing.metaTitle"), description: t("landing.metaDescription") };
}

export default async function Home({ searchParams }: PageProps<"/">) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { t, locale } = await getT();
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const role = ROLES.find((r) => r === one(sp.role)) ?? null;
  const source = one(sp.ref) || one(sp.utm_source);

  return (
    <div className="space-y-14">
      <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white sm:px-12">
        <p className="mx-auto inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
          {t("landing.badge")}
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{t("landing.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-stone-300">{t("landing.subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/?role=CONTRACTOR#waitlist" scroll={false} className={btnCls}>{t("landing.ctaHire")}</Link>
          <Link
            href="/?role=SUBCONTRACTOR#waitlist"
            scroll={false}
            className="inline-flex items-center justify-center rounded-md border border-stone-600 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
          >
            {t("landing.ctaWork")}
          </Link>
        </div>
        <p className="mt-6 text-sm text-stone-400">
          {t("landing.haveInvite")} <Link href="/login" className="font-medium text-amber-400 underline">{t("nav.login")}</Link>
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Benefits title={t("landing.forContractors")} items={[t("landing.contractor1"), t("landing.contractor2"), t("landing.contractor3")]} />
        <Benefits title={t("landing.forSubs")} items={[t("landing.sub1"), t("landing.sub2"), t("landing.sub3")]} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">{t("landing.betaTitle")}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[t("landing.beta1"), t("landing.beta2"), t("landing.beta3")].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-500 font-bold text-stone-950">{i + 1}</span>
              <span className="text-sm text-stone-700">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="waitlist" className="mx-auto max-w-2xl scroll-mt-6">
        <h2 className="text-2xl font-bold tracking-tight">{t("waitlist.title")}</h2>
        <p className="mt-1 text-sm text-stone-600">{t("waitlist.subtitle")}</p>
        <Card className="mt-4">
          {/* The key resets the form when a hero button picks a different role. */}
          <OneShotForm key={role ?? "none"} action={joinWaitlist} submitLabel={t("waitlist.submit")}>
            <input type="hidden" name="source" value={source} />
            <div aria-hidden className="hidden">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm font-medium">{t("auth.iAm")}</legend>
              {ROLES.map((r) => (
                <label key={r} className="flex cursor-pointer gap-3 rounded-md border border-stone-200 p-3 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                  <input type="radio" name="role" value={r} required defaultChecked={r === role} className="mt-1 accent-amber-500" />
                  <span>
                    <span className="block text-sm font-semibold">{t(`role.${r}`)}</span>
                    <span className="block text-xs text-stone-600">{t(`role.${r}.desc`)}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("profile.name")}>
                <input name="name" required maxLength={120} autoComplete="name" className={inputCls} />
              </Field>
              <Field label={t("auth.email")}>
                <input name="email" type="email" required autoComplete="email" className={inputCls} />
              </Field>
              <Field label={t("profile.company")} hint={t("waitlist.optional")}>
                <input name="companyName" maxLength={200} autoComplete="organization" className={inputCls} />
              </Field>
              <Field label={t("profile.regCode")} hint={t("waitlist.regCodeHint")}>
                <input name="regCode" maxLength={40} inputMode="numeric" className={inputCls} />
              </Field>
              <Field label={t("profile.phone")} hint={t("waitlist.optional")}>
                <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputCls} />
              </Field>
              <Field label={t("waitlist.region")}>
                <select name="region" required defaultValue="harju" className={inputCls}>
                  {WAITLIST_REGIONS.map((r) => (
                    <option key={r} value={r}>{t(`waitlist.region.${r}`)}</option>
                  ))}
                </select>
              </Field>
            </div>
            <fieldset>
              <legend className="text-sm font-medium">{t("waitlist.trades")}</legend>
              <p className="mb-2 text-xs text-stone-500">{t("waitlist.tradesHint")}</p>
              <TradeCheckboxes trades={TRADES} selected={[]} locale={locale} />
            </fieldset>
            <Field label={t("waitlist.message")} hint={t("waitlist.optional")}>
              <textarea name="message" rows={3} maxLength={2000} placeholder={t("waitlist.messagePlaceholder")} className={inputCls} />
            </Field>
            <label className="flex gap-3 text-sm text-stone-700">
              <input type="checkbox" name="consent" required className="mt-1 accent-amber-500" />
              <span>
                {t("waitlist.consent")}{" "}
                <Link href="/privacy" target="_blank" className="text-amber-700 underline">{t("waitlist.privacy")}</Link>
              </span>
            </label>
          </OneShotForm>
        </Card>
      </section>

      <section className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-xl font-bold">{t("faq.title")}</h2>
        <Faq t={t} />
      </section>
    </div>
  );
}

function Benefits({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-stone-700">
            <span aria-hidden className="font-bold text-amber-600">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Faq({ t }: { t: T }) {
  const items = [
    [t("faq.q1"), t("faq.a1")],
    [t("faq.q2"), t("faq.a2")],
    [t("faq.q3"), t("faq.a3")],
    [t("faq.q4"), t("faq.a4")],
  ];
  return (
    <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
      {items.map(([q, a]) => (
        <details key={q} className="group px-5 py-4">
          <summary className="cursor-pointer list-none font-medium marker:hidden">
            <span className="mr-2 inline-block text-amber-600 transition group-open:rotate-90">›</span>
            {q}
          </summary>
          <p className="mt-2 text-sm text-stone-600">{a}</p>
        </details>
      ))}
    </div>
  );
}
