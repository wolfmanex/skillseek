/** A paragraph, a bullet list, or a table. Text may contain {company}, {regCode}, {address} and {email}. */
export type LegalBlock = string | { list: string[] } | { table: { head: string[]; rows: string[][] } };

export type LegalSection = { heading: string; body: LegalBlock[] };

export type LegalDoc = { title: string; intro: LegalBlock[]; sections: LegalSection[] };

export type LegalTexts = { privacy: LegalDoc; terms: LegalDoc };
