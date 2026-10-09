import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import { canPost } from "@/lib/matching";
import { getT } from "@/lib/i18n";
import { createPosting } from "@/server/posting-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { CountySelect, TradeCheckboxes } from "@/components/pickers";
import { Card, Field, PageHeader, inputCls } from "@/components/ui";

export default async function NewPostingPage() {
  const user = await requireProfile();
  if (!canPost(user.role)) redirect("/postings");
  const { t, locale } = await getT();
  const trades = await db.trade.findMany({ orderBy: { nameEn: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("postings.new")} subtitle={t("postings.newSubtitle")} />
      <ActionForm action={createPosting} className="space-y-6">
        <Card className="space-y-4">
          <Field label={t("posting.title")} hint={t("posting.titleHint")}>
            <input name="title" required maxLength={140} className={inputCls} />
          </Field>
          <Field label={t("posting.description")} hint={t("posting.descriptionHint")}>
            <textarea name="description" required rows={6} className={inputCls} />
          </Field>
          <Field label={t("posting.seeking")}>
            <select name="seeking" defaultValue="ANY" className={inputCls}>
              {(["ANY", "SUBCONTRACTOR", "SPECIALIST"] as const).map((s) => (
                <option key={s} value={s}>{t(`seeking.${s}`)}</option>
              ))}
            </select>
          </Field>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-semibold">{t("posting.trades")}</h2>
          <TradeCheckboxes trades={trades} selected={[]} locale={locale} />
        </Card>
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("profile.county")}>
              <CountySelect name="county" required value={user.profile.county} placeholder={t("common.choose")} />
            </Field>
            <Field label={t("posting.city")}>
              <input name="city" className={inputCls} />
            </Field>
            <Field label={t("posting.startDate")}>
              <input name="startDate" type="date" className={inputCls} />
            </Field>
            <Field label={t("posting.endDate")}>
              <input name="endDate" type="date" className={inputCls} />
            </Field>
            <Field label={t("posting.budgetMin")}>
              <input name="budgetMin" type="number" min={0} className={inputCls} />
            </Field>
            <Field label={t("posting.budgetMax")}>
              <input name="budgetMax" type="number" min={0} className={inputCls} />
            </Field>
          </div>
          <Field label={t("posting.requiredCerts")} hint={t("profile.certificationsHint")}>
            <textarea name="requiredCerts" rows={2} className={inputCls} />
          </Field>
        </Card>
        <SubmitButton>{t("postings.publish")}</SubmitButton>
      </ActionForm>
    </div>
  );
}
