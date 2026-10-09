// The 27 EU member states, stored as ISO 3166-1 alpha-2 codes. Names come from Intl in the UI language.
export const COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

export type Country = (typeof COUNTRIES)[number];

const displayNames = new Map<string, Intl.DisplayNames>();

export function countryName(code: string | null | undefined, locale = "en"): string {
  if (!code) return "";
  let names = displayNames.get(locale);
  if (!names) {
    names = new Intl.DisplayNames([locale], { type: "region" });
    displayNames.set(locale, names);
  }
  return names.of(code) ?? code;
}

/** Country codes sorted by their name in the given language. */
export function sortedCountries(locale: string): Country[] {
  return [...COUNTRIES].sort((a, b) => countryName(a, locale).localeCompare(countryName(b, locale), locale));
}

export function isCountry(value: string): value is Country {
  return (COUNTRIES as readonly string[]).includes(value);
}

// Seeded into the Trade table; slugs are stable identifiers.
export const TRADES: { slug: string; nameEn: string; nameEt: string; nameFi: string }[] = [
  { slug: "general-construction", nameEn: "General construction", nameEt: "Üldehitus", nameFi: "Yleisrakentaminen" },
  { slug: "concrete", nameEn: "Concrete work", nameEt: "Betoonitööd", nameFi: "Betonityöt" },
  { slug: "masonry", nameEn: "Masonry", nameEt: "Müüritööd", nameFi: "Muuraustyöt" },
  { slug: "carpentry", nameEn: "Carpentry", nameEt: "Puusepatööd", nameFi: "Kirvesmiestyöt" },
  { slug: "roofing", nameEn: "Roofing", nameEt: "Katusetööd", nameFi: "Kattotyöt" },
  { slug: "facade", nameEn: "Facade work", nameEt: "Fassaaditööd", nameFi: "Julkisivutyöt" },
  { slug: "electrical", nameEn: "Electrical", nameEt: "Elektritööd", nameFi: "Sähkötyöt" },
  { slug: "plumbing", nameEn: "Plumbing", nameEt: "Torutööd", nameFi: "Putkityöt" },
  { slug: "hvac", nameEn: "HVAC / ventilation", nameEt: "Küte ja ventilatsioon", nameFi: "LVI / ilmanvaihto" },
  { slug: "drywall", nameEn: "Drywall", nameEt: "Kipsplaaditööd", nameFi: "Kipsilevytyöt" },
  { slug: "painting", nameEn: "Painting & finishing", nameEt: "Maalri- ja viimistlustööd", nameFi: "Maalaus- ja pintatyöt" },
  { slug: "tiling", nameEn: "Tiling", nameEt: "Plaatimistööd", nameFi: "Laatoitus" },
  { slug: "flooring", nameEn: "Flooring", nameEt: "Põrandatööd", nameFi: "Lattiatyöt" },
  { slug: "insulation", nameEn: "Insulation", nameEt: "Soojustustööd", nameFi: "Eristystyöt" },
  { slug: "welding", nameEn: "Welding & steelwork", nameEt: "Keevitus- ja metallitööd", nameFi: "Hitsaus- ja teräsrakennetyöt" },
  { slug: "earthworks", nameEn: "Earthworks", nameEt: "Pinnasetööd", nameFi: "Maanrakennustyöt" },
  { slug: "demolition", nameEn: "Demolition", nameEt: "Lammutustööd", nameFi: "Purkutyöt" },
  { slug: "landscaping", nameEn: "Landscaping", nameEt: "Haljastustööd", nameFi: "Viherrakentaminen" },
  { slug: "windows-doors", nameEn: "Windows & doors", nameEt: "Akende ja uste paigaldus", nameFi: "Ikkuna- ja oviasennukset" },
  { slug: "scaffolding", nameEn: "Scaffolding", nameEt: "Tellingutööd", nameFi: "Telinetyöt" },
];
