import { getT } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>
      <div className="mt-6"><ButtonLink href="/">{t("notFound.home")}</ButtonLink></div>
    </div>
  );
}
