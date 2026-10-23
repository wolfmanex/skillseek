import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { legalDoc } from "@/lib/legal";
import { LegalDocument } from "@/components/legal-doc";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  return { title: `${legalDoc("privacy", locale).title} · Skillseek` };
}

export default async function PrivacyPage() {
  const { t, locale } = await getT();
  return <LegalDocument doc={legalDoc("privacy", locale)} t={t} locale={locale} />;
}
