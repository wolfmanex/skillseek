import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { login } from "@/server/auth-actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Card, Field, inputCls } from "@/components/ui";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">{t("auth.loginTitle")}</h1>
      <Card>
        <ActionForm action={login}>
          <Field label={t("auth.email")}>
            <input name="email" type="email" required autoComplete="email" className={inputCls} />
          </Field>
          <Field label={t("auth.password")}>
            <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
          </Field>
          <SubmitButton className="w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400">
            {t("auth.login")}
          </SubmitButton>
        </ActionForm>
      </Card>
      <p className="mt-4 text-center text-sm text-stone-600">
        {t("auth.noAccount")} <Link href="/signup" className="font-medium text-amber-700 underline">{t("nav.signup")}</Link>
      </p>
    </div>
  );
}
