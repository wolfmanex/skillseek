import { requireUser, sessionIsFresh } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { changePassword, deleteAccount } from "@/server/auth-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Card, Field, PageHeader, btnDangerCls, btnSecondaryCls, inputCls } from "@/components/ui";

export default async function AccountPage() {
  const user = await requireUser();
  const fresh = await sessionIsFresh();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-md space-y-6">
      <PageHeader title={t("account.title")} subtitle={user.email} />
      <Card>
        <ActionForm action={changePassword}>
          <h2 className="font-semibold">{t("account.password")}</h2>
          {!fresh && (
            <Field label={t("account.current")}>
              <input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
            </Field>
          )}
          <Field label={t("account.new")} hint={t("auth.passwordHint")}>
            <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <SubmitButton>{t("common.save")}</SubmitButton>
        </ActionForm>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold">{t("account.export.title")}</h2>
        <p className="text-sm text-stone-600">{t("account.export.body")}</p>
        {/* A plain link: the route answers with a file download. */}
        <a href="/account/export" download className={btnSecondaryCls}>
          {t("account.export.button")}
        </a>
      </Card>

      <Card className="border-red-200">
        <ActionForm action={deleteAccount}>
          <h2 className="font-semibold text-red-700">{t("account.delete.title")}</h2>
          <p className="text-sm text-stone-600">{t("account.delete.body")}</p>
          <Field label={t("account.delete.confirmEmail", { email: user.email })}>
            <input name="confirmEmail" type="email" required autoComplete="off" className={inputCls} />
          </Field>
          {!fresh && (
            <Field label={t("account.current")}>
              <input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
            </Field>
          )}
          <SubmitButton className={btnDangerCls}>{t("account.delete.button")}</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
