import Link from "next/link";
import { getT } from "@/lib/i18n";
import { Card } from "@/components/ui";

export default async function ClaimRemovedPage() {
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-3 text-center">
        <p className="text-sm text-stone-700">{t("claim.removed")}</p>
        <Link href="/" className="text-sm font-medium text-amber-700 underline">{t("notFound.home")}</Link>
      </Card>
    </div>
  );
}
