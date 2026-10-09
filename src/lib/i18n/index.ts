import { cookies } from "next/headers";
import { en, type Dictionary } from "./en";
import { et } from "./et";
import { fi } from "./fi";

export const LOCALES = ["en", "et", "fi"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, et, fi };

// BCP 47 tags for dates and numbers. English uses Irish formatting for euro amounts.
const DATE_TAGS: Record<Locale, string> = { en: "en-GB", et: "et-EE", fi: "fi-FI" };
const NUMBER_TAGS: Record<Locale, string> = { en: "en-IE", et: "et-EE", fi: "fi-FI" };

export function dateTag(locale: Locale) {
  return DATE_TAGS[locale];
}

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

export function tradeName(trade: { nameEn: string; nameEt: string; nameFi: string }, locale: Locale) {
  if (locale === "et") return trade.nameEt;
  if (locale === "fi") return trade.nameFi || trade.nameEn;
  return trade.nameEn;
}

/** Trades sorted by their name in the given language. */
export function sortTrades<Tr extends { nameEn: string; nameEt: string; nameFi: string }>(trades: Tr[], locale: Locale) {
  return [...trades].sort((a, b) => tradeName(a, locale).localeCompare(tradeName(b, locale), DATE_TAGS[locale]));
}

export function formatDate(date: Date | null | undefined, locale: Locale) {
  if (!date) return "";
  return date.toLocaleDateString(DATE_TAGS[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatEuro(amount: number, locale: Locale) {
  return new Intl.NumberFormat(NUMBER_TAGS[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
