import { cookies } from "next/headers";
import { en, type Dictionary } from "./en";
import { et } from "./et";

export const LOCALES = ["en", "et"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, et };

export type TKey = keyof Dictionary;
export type T = (key: TKey, vars?: Record<string, string | number>) => string;

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function translator(locale: Locale): T {
  const dict = dictionaries[locale];
  return (key, vars) => {
    let text: string = dict[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
    return text;
  };
}

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getT() {
  const locale = await getLocale();
  return { t: translator(locale), locale };
}

export function tradeName(trade: { nameEn: string; nameEt: string }, locale: Locale) {
  return locale === "et" ? trade.nameEt : trade.nameEn;
}

export function formatDate(date: Date | null | undefined, locale: Locale) {
  if (!date) return "";
  return date.toLocaleDateString(locale === "et" ? "et-EE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatEuro(amount: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "et" ? "et-EE" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
