import Link from "next/link";
import { getT } from "@/lib/i18n";
import { signInWithLink } from "@/server/auth-actions";
import { SubmitButton } from "@/components/forms";
import { Card } from "@/components/ui";

// The link lands here and the user confirms with a button, so email scanners
// that pre-open links can't use up the one-time token.
export default async function VerifyPage({ searchParams }: PageProps<"/auth/verify">) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const { t } = await getT();

  return (
    <div className="mx-auto max-w-sm">
      <Card className="space-y-4 text-center">
        {sp.error || !token ? (
          <>
            <p className="text-sm text-stone-700">{t("auth.linkInvalid")}</p>
            <Link href="/login" className="text-sm font-medium text-amber-700 underline">{t("auth.loginTitle")}</Link>
          </>
        ) : (
          <form action={signInWithLink} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <h1 className="text-xl font-bold">{t("auth.loginTitle")}</h1>
            <SubmitButton className="w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400">
              {t("auth.continue")}
            </SubmitButton>
          </form>
        )}
      </Card>
    </div>
  );
}
