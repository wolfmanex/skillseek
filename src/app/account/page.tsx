import { requireUser, sessionIsFresh } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { changePassword } from "@/server/auth-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Card, Field, PageHeader, inputCls } from "@/components/ui";

export default async function AccountPage() {
  const user = await requireUser();
  const fresh = await sessionIsFresh();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-md">
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
    </div>
  );
}
