import Link from "next/link";
import { getT } from "@/lib/i18n";
import { Card } from "@/components/ui";

export default async function AccountDeletedPage() {
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-sm">
      <Card className="space-y-4 text-center">
        <h1 className="text-xl font-bold">{t("account.deleted.title")}</h1>
        <p className="text-sm text-stone-700">{t("account.deleted.body")}</p>
        <Link href="/" className="text-sm font-medium text-amber-700 underline">{t("notFound.home")}</Link>
      </Card>
    </div>
  );
}
