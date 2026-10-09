// The 15 Estonian counties (maakonnad). Stored by slug, displayed via i18n.
export const COUNTIES = [
  "harju",
  "hiiu",
  "ida-viru",
  "jogeva",
  "jarva",
  "laane",
  "laane-viru",
  "polva",
  "parnu",
  "rapla",
  "saare",
  "tartu",
  "valga",
  "viljandi",
  "voru",
] as const;

export type County = (typeof COUNTIES)[number];

export const COUNTY_NAMES: Record<County, string> = {
  harju: "Harjumaa",
  hiiu: "Hiiumaa",
  "ida-viru": "Ida-Virumaa",
  jogeva: "Jõgevamaa",
  jarva: "Järvamaa",
  laane: "Läänemaa",
  "laane-viru": "Lääne-Virumaa",
  polva: "Põlvamaa",
  parnu: "Pärnumaa",
  rapla: "Raplamaa",
  saare: "Saaremaa",
  tartu: "Tartumaa",
  valga: "Valgamaa",
  viljandi: "Viljandimaa",
  voru: "Võrumaa",
};

export function countyName(slug: string | null | undefined): string {
  if (!slug) return "";
  return COUNTY_NAMES[slug as County] ?? slug;
}

export function isCounty(value: string): value is County {
  return (COUNTIES as readonly string[]).includes(value);
}

// Seeded into the Trade table; slugs are stable identifiers.
export const TRADES: { slug: string; nameEn: string; nameEt: string }[] = [
  { slug: "general-construction", nameEn: "General construction", nameEt: "Üldehitus" },
  { slug: "concrete", nameEn: "Concrete work", nameEt: "Betoonitööd" },
  { slug: "masonry", nameEn: "Masonry", nameEt: "Müüritööd" },
  { slug: "carpentry", nameEn: "Carpentry", nameEt: "Puusepatööd" },
  { slug: "roofing", nameEn: "Roofing", nameEt: "Katusetööd" },
  { slug: "facade", nameEn: "Facade work", nameEt: "Fassaaditööd" },
  { slug: "electrical", nameEn: "Electrical", nameEt: "Elektritööd" },
  { slug: "plumbing", nameEn: "Plumbing", nameEt: "Torutööd" },
  { slug: "hvac", nameEn: "HVAC / ventilation", nameEt: "Küte ja ventilatsioon" },
  { slug: "drywall", nameEn: "Drywall", nameEt: "Kipsplaaditööd" },
  { slug: "painting", nameEn: "Painting & finishing", nameEt: "Maalri- ja viimistlustööd" },
  { slug: "tiling", nameEn: "Tiling", nameEt: "Plaatimistööd" },
  { slug: "flooring", nameEn: "Flooring", nameEt: "Põrandatööd" },
  { slug: "insulation", nameEn: "Insulation", nameEt: "Soojustustööd" },
  { slug: "welding", nameEn: "Welding & steelwork", nameEt: "Keevitus- ja metallitööd" },
  { slug: "earthworks", nameEn: "Earthworks", nameEt: "Pinnasetööd" },
  { slug: "demolition", nameEn: "Demolition", nameEt: "Lammutustööd" },
  { slug: "landscaping", nameEn: "Landscaping", nameEt: "Haljastustööd" },
  { slug: "windows-doors", nameEn: "Windows & doors", nameEt: "Akende ja uste paigaldus" },
  { slug: "scaffolding", nameEn: "Scaffolding", nameEt: "Tellingutööd" },
];
