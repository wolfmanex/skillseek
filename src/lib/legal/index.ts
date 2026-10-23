import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { et } from "./et";
import { fi } from "./fi";
import type { LegalDoc, LegalTexts } from "./types";

export type { LegalBlock, LegalDoc } from "./types";

/**
 * The operator named in the privacy policy and terms.
 */
export const OPERATOR = {
  company: "Wolfman OÜ",
  regCode: "17106702",
  address: "L. Tolstoi tn 6-2, 50106 Tartu",
  email: "tonu.mets@wolfmanex.com",
};

/** Shown on both pages as the last-updated date. Change it whenever the texts change. */
export const LEGAL_UPDATED = new Date("2026-10-23T00:00:00Z");

/** Both texts are drafts until a lawyer has reviewed them. Set to false after review. */
export const LEGAL_DRAFT = true;

const texts: Record<Locale, LegalTexts> = { en, et, fi };

export function legalDoc(kind: keyof LegalTexts, locale: Locale): LegalDoc {
  return texts[locale][kind];
}

/** Replaces {company}, {regCode}, {address} and {email} with the operator's details. */
export function fillOperator(text: string) {
  return text.replace(/\{(company|regCode|address|email)\}/g, (_, key: keyof typeof OPERATOR) => OPERATOR[key]);
}
