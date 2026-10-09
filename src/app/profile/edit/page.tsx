import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { saveProfile } from "@/server/profile-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { CountyCheckboxes, CountySelect, TradeCheckboxes } from "@/components/pickers";
import { Card, Field, PageHeader, inputCls } from "@/components/ui";

export default async function EditProfilePage() {
  const user = await requireUser();
  const { t, locale } = await getT();
  const trades = await db.trade.findMany({ orderBy: { nameEn: "asc" } });
  const p = user.profile;
  const isPro = user.role !== "CONTRACTOR";
  const isCompany = user.role !== "SPECIALIST";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={p ? t("profile.editTitle") : t("profile.createTitle")}
        subtitle={p ? undefined : t("profile.createSubtitle")}
      />
      <ActionForm action={saveProfile} className="space-y-6">
        <Card className="space-y-4">
          <h2 className="font-semibold">{t("profile.section.basics")}</h2>
          <Field label={isCompany ? t("profile.contactName") : t("profile.name")}>
            <input name="displayName" required defaultValue={p?.displayName} className={inputCls} />
          </Field>
          {isCompany && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("profile.company")}>
                <input name="companyName" defaultValue={p?.companyName ?? ""} className={inputCls} />
              </Field>
              <Field label={t("profile.regCode")} hint={t("profile.regCodeHint")}>
                <input name="regCode" defaultValue={p?.regCode ?? ""} inputMode="numeric" className={inputCls} />
              </Field>
            </div>
          )}
          <Field label={t("profile.bio")}>
            <textarea name="bio" rows={4} defaultValue={p?.bio} className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t("profile.phone")}>
              <input name="phone" type="tel" defaultValue={p?.phone ?? ""} className={inputCls} />
            </Field>
            <Field label={t("profile.website")}>
              <input name="website" defaultValue={p?.website ?? ""} className={inputCls} />
            </Field>
            <Field label={t("profile.county")}>
              <CountySelect name="county" value={p?.county} placeholder={t("common.choose")} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold">{isPro ? t("profile.section.trades") : t("profile.section.tradesContractor")}</h2>
          <TradeCheckboxes trades={trades} selected={p?.trades.map((tr) => tr.slug) ?? []} locale={locale} />
        </Card>

        {isPro && (
          <Card className="space-y-4">
            <h2 className="font-semibold">{t("profile.section.work")}</h2>
            <Field label={t("profile.serviceCounties")}>
              <CountyCheckboxes name="serviceCounties" selected={p?.serviceCounties ?? []} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={t("profile.years")}>
                <input name="yearsExperience" type="number" min={0} defaultValue={p?.yearsExperience ?? ""} className={inputCls} />
              </Field>
              <Field label={t("profile.rate")}>
                <input name="hourlyRate" type="number" min={0} defaultValue={p?.hourlyRate ?? ""} className={inputCls} />
              </Field>
              <Field label={t("profile.availableFrom")}>
                <input
                  name="availableFrom"
                  type="date"
                  defaultValue={p?.availableFrom?.toISOString().slice(0, 10) ?? ""}
                  className={inputCls}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="available" defaultChecked={p?.available ?? true} className="accent-amber-500" />
              {t("profile.available")}
            </label>
            <Field label={t("profile.certifications")} hint={t("profile.certificationsHint")}>
              <textarea name="certifications" rows={3} defaultValue={p?.certifications.join("\n")} className={inputCls} />
            </Field>
            <Field label={t("profile.portfolio")} hint={t("profile.portfolioHint")}>
              <textarea name="portfolioUrls" rows={3} defaultValue={p?.portfolioUrls.join("\n")} className={inputCls} />
            </Field>
          </Card>
        )}

        <SubmitButton>{t("common.save")}</SubmitButton>
      </ActionForm>
    </div>
  );
}
