import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { signup } from "@/server/auth-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Card, Field, inputCls } from "@/components/ui";

const ROLES = ["CONTRACTOR", "SUBCONTRACTOR", "SPECIALIST"] as const;

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">{t("auth.signupTitle")}</h1>
      <Card>
        <ActionForm action={signup}>
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
            <input name="email" type="email" required autoComplete="email" className={inputCls} />
          </Field>
          <Field label={t("auth.password")} hint={t("auth.passwordHint")}>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <SubmitButton className="w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400">
            {t("auth.signup")}
          </SubmitButton>
        </ActionForm>
      </Card>
      <p className="mt-4 text-center text-sm text-stone-600">
        {t("auth.haveAccount")} <Link href="/login" className="font-medium text-amber-700 underline">{t("nav.login")}</Link>
      </p>
    </div>
  );
}
