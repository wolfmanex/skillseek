// Turns records from the Estonian Business Register open data (avaandmed.ariregister.rik.ee,
// "general data" JSON, CC BY 4.0) into Company rows. Pure functions, so they are unit tested
// and shared by the import script and the admin CSV upload.

export const ARIREGISTER_GENERAL_JSON_URL =
  "https://avaandmed.ariregister.rik.ee/sites/default/files/avaandmed/ettevotja_rekvisiidid__yldandmed.json.zip";
export const ARIREGISTER_ATTRIBUTION = "Contains data from the Estonian e-Business Register (RIK), CC BY 4.0";

export type CompanyInput = {
  regCode: string;
  name: string;
  legalForm: string | null;
  status: string;
  address: string | null;
  county: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  emtakCodes: string[];
  mainEmtak: string | null;
  tradeSlugs: string[];
  foundedAt: Date | null;
};

// Sole proprietors (FIE) are natural persons, so their records are personal data; non-profits
// and housing associations aren't construction firms. Neither is imported.
const EXCLUDED_LEGAL_FORMS = new Set(["FIE", "MTÜ", "SA", "KÜ", "HÜ", "MÜ"]);
// R registered, L in liquidation, N in bankruptcy. Only registered firms are added; the others
// still come through so firms already imported get their new status.
export const ACTIVE_STATUS = "R";
const KNOWN_STATUSES = new Set(["R", "L", "N"]);

// EMTAK codes are NACE codes with an extra digit, so the first four digits are the NACE class.
// Section F (41-43) is construction; metal structures and landscaping match two of our trades.
const ELIGIBLE_PREFIXES = ["41", "42", "43", "2511", "8130"];

const CLASS_TRADES: Record<string, string[]> = {
  "4120": ["general-construction"],
  "4100": ["general-construction"],
  "4211": ["earthworks"],
  "4212": ["earthworks"],
  "4213": ["earthworks"],
  "4221": ["plumbing"],
  "4222": ["electrical"],
  "4291": ["earthworks"],
  "4311": ["demolition"],
  "4312": ["earthworks"],
  "4313": ["earthworks"],
  "4321": ["electrical"],
  "4322": ["plumbing", "hvac"],
  "4329": ["insulation"],
  "4331": ["drywall"],
  "4332": ["windows-doors", "carpentry"],
  "4333": ["flooring", "tiling"],
  "4334": ["painting"],
  "4339": ["painting"],
  "4341": ["roofing"],
  "2511": ["welding"],
  "8130": ["landscaping"],
};

// The activity text refines broad classes like "other specialised construction" (43.99), and
// tells 43.91 apart: roofing in EMTAK 2008, masonry in EMTAK 2025.
const TEXT_TRADES: [RegExp, string][] = [
  [/elektri/, "electrical"],
  [/torustik|veevarustus|kanalisatsioon|sanitaar/, "plumbing"],
  [/kütte|ventilatsioon|kliima/, "hvac"],
  [/katus/, "roofing"],
  [/müüri|kivi/, "masonry"],
  [/betoon|vundament/, "concrete"],
  [/krohvi|kips/, "drywall"],
  [/puusepa|tisleri|palk/, "carpentry"],
  [/akende|aknad|uste |uksed/, "windows-doors"],
  [/põrand/, "flooring"],
  [/plaati/, "tiling"],
  [/maalri|värvi/, "painting"],
  [/soojust|isolatsioon/, "insulation"],
  [/lammut/, "demolition"],
  [/pinnase|kaeve|ehitusplatsi ettevalmist/, "earthworks"],
  [/telling/, "scaffolding"],
  [/fassaad/, "facade"],
  [/metallkonstruktsioon|keevit/, "welding"],
  [/haljast/, "landscaping"],
  [/elamute ehitus|mitteelamute ehitus|hoonete ehitus/, "general-construction"],
];

export function isConstructionActivity(code: string) {
  return ELIGIBLE_PREFIXES.some((p) => code.startsWith(p));
}

/** Our trade slugs for one EMTAK activity, from its code and (Estonian) description. */
export function tradesForActivity(code: string, text = ""): string[] {
  const slugs = new Set(CLASS_TRADES[code.slice(0, 4)] ?? []);
  const lower = text.toLowerCase();
  for (const [re, slug] of TEXT_TRADES) if (re.test(lower)) slugs.add(slug);
  if (code.startsWith("4391") && !slugs.has("masonry")) slugs.add("roofing");
  if (slugs.size === 0 && code.startsWith("42")) slugs.add("earthworks");
  if (slugs.size === 0 && code.startsWith("41")) slugs.add("general-construction");
  return [...slugs];
}

type Raw = Record<string, unknown>;
const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const arr = (v: unknown): Raw[] => (Array.isArray(v) ? v.map(obj) : []);
const text = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const current = (items: Raw[]) => items.filter((i) => !text(i.lopp_kpv));

// Dates in the register are "DD.MM.YYYY" (sometimes ISO).
export function parseRegistryDate(value: unknown): Date | null {
  const s = text(value);
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const d = m ? new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`) : /^\d{4}-\d{2}-\d{2}/.test(s) ? new Date(s) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

export function normalizeWebsite(value: string): string | null {
  const v = value.trim();
  if (!v || /\s/.test(v) || !v.includes(".")) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v.replace(/^\/+/, "")}`;
}

function contacts(items: Raw[]) {
  let email: string | null = null;
  let phone: string | null = null;
  let website: string | null = null;
  for (const item of current(items)) {
    const kind = text(item.liik).toUpperCase();
    const value = text(item.sisu);
    if (!value) continue;
    if (!email && (kind === "EMAIL" || (!kind && value.includes("@")))) email = value.toLowerCase();
    else if (!phone && ["MOB", "TEL", "TELEFON", "MOBIIL"].includes(kind)) phone = value;
    else if (!website && ["WWW", "VEEB", "URL", "INTERNET"].includes(kind)) website = normalizeWebsite(value);
  }
  return { email, phone, website };
}

// "Harju maakond, Tallinn, Kesklinna linnaosa" → county "Harju maakond", city "Tallinn".
export function splitEhak(name: string) {
  const parts = name.split(",").map((s) => s.trim()).filter(Boolean);
  const county = parts.find((p) => p.endsWith("maakond")) ?? null;
  const city = parts.find((p) => !p.endsWith("maakond")) ?? null;
  return { county, city };
}

function address(items: Raw[]) {
  const list = current(items);
  const a = list[list.length - 1];
  if (!a) return { address: null, county: null, city: null };
  const ehak = text(a.ehak_nimetus);
  const full =
    text(a.aadress_ads__ads_normaliseeritud_taisaadress) ||
    [text(a.tanav_maja_korter), ehak, text(a.postiindeks)].filter(Boolean).join(", ");
  return { address: full || null, ...splitEhak(ehak) };
}

/**
 * Maps one company from the general data dump to a Company row, or null when it isn't a
 * construction firm we may import. `mainOnly` requires the construction activity to be
 * the firm's main activity.
 */
export function parseRegistryCompany(raw: unknown, { mainOnly = false } = {}): CompanyInput | null {
  const record = obj(raw);
  // The dump nests most fields under "yldandmed"; accept flat records too.
  const general = { ...record, ...obj(record.yldandmed) };

  const regCode = text(record.ariregistri_kood ?? general.ariregistri_kood);
  const name = text(record.nimi ?? general.nimi);
  if (!/^\d{8}$/.test(regCode) || !name) return null;

  const legalForm = text(general.oiguslik_vorm) || null;
  if (legalForm && EXCLUDED_LEGAL_FORMS.has(legalForm.toUpperCase())) return null;
  const status = text(general.staatus);
  if (!KNOWN_STATUSES.has(status)) return null;

  const activities = current(arr(general.teatatud_tegevusalad))
    .map((a) => ({ code: text(a.emtak_kood), text: text(a.emtak_tekstina), main: a.on_pohitegevusala === true }))
    .filter((a) => /^\d{4,5}$/.test(a.code));
  const construction = activities.filter((a) => isConstructionActivity(a.code));
  if (construction.length === 0) return null;
  if (mainOnly && !construction.some((a) => a.main)) return null;

  return {
    regCode,
    name,
    legalForm,
    status,
    ...address(arr(general.aadressid)),
    ...contacts(arr(general.sidevahendid)),
    emtakCodes: [...new Set(activities.map((a) => a.code))],
    mainEmtak: activities.find((a) => a.main)?.code ?? null,
    tradeSlugs: [...new Set(construction.flatMap((a) => tradesForActivity(a.code, a.text)))],
    foundedAt: parseRegistryDate(general.esmaregistreerimise_kpv),
  };
}

/**
 * Splits a large top-level JSON array into its elements without holding the whole document,
 * so the multi-hundred-megabyte dump can be streamed. Feed text chunks; complete elements
 * come back as parsed values.
 */
export class JsonArraySplitter {
  private buf = "";
  private depth = 0;
  private inString = false;
  private escaped = false;
  private start = -1;

  push(chunk: string): unknown[] {
    const out: unknown[] = [];
    const base = this.buf.length;
    this.buf += chunk;
    for (let i = base; i < this.buf.length; i++) {
      const c = this.buf[i];
      if (this.inString) {
        if (this.escaped) this.escaped = false;
        else if (c === "\\") this.escaped = true;
        else if (c === '"') this.inString = false;
        continue;
      }
      if (c === '"') this.inString = true;
      else if (c === "{" || c === "[") {
        // Depth 1 is inside the top-level array; elements start at depth 1.
        if (this.depth === 1 && this.start < 0) this.start = i;
        this.depth++;
      } else if (c === "}" || c === "]") {
        this.depth--;
        if (this.depth === 1 && this.start >= 0) {
          out.push(JSON.parse(this.buf.slice(this.start, i + 1)));
          this.start = -1;
        }
      }
    }
    // Drop what's already parsed so the buffer only holds the element in progress.
    const keep = this.start >= 0 ? this.start : this.buf.length;
    this.buf = this.buf.slice(keep);
    if (this.start >= 0) this.start = 0;
    return out;
  }
}

/** Parses the admin CSV upload: a header row naming any of the columns below, comma or semicolon separated. */
export function parseCompanyCsv(csv: string): { rows: CompanyInput[]; skipped: number } {
  const lines = csv.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], skipped: 0 };
  const sep = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const header = splitCsvLine(lines[0], sep).map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"));
  const col = (row: string[], ...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i >= 0 && row[i]?.trim()) return row[i].trim();
    }
    return "";
  };

  const rows: CompanyInput[] = [];
  let skipped = 0;
  for (const line of lines.slice(1)) {
    const r = splitCsvLine(line, sep);
    const regCode = col(r, "reg_code", "regcode", "registrikood", "ariregistri_kood").replace(/\s/g, "");
    const name = col(r, "name", "nimi");
    if (!/^\d{8}$/.test(regCode) || !name) {
      skipped++;
      continue;
    }
    const emtakCodes = col(r, "emtak", "emtak_codes").split(/[\s;|]+/).filter((c) => /^\d{4,5}$/.test(c));
    const listedTrades = col(r, "trades").split(/[\s;|]+/).filter(Boolean);
    const website = col(r, "website", "www", "veeb");
    rows.push({
      regCode,
      name,
      legalForm: col(r, "legal_form", "oiguslik_vorm") || null,
      status: ACTIVE_STATUS,
      address: col(r, "address", "aadress") || null,
      county: col(r, "county", "maakond") || null,
      city: col(r, "city", "linn") || null,
      email: col(r, "email", "e_post").toLowerCase() || null,
      phone: col(r, "phone", "telefon") || null,
      website: website ? normalizeWebsite(website) : null,
      emtakCodes,
      mainEmtak: emtakCodes[0] ?? null,
      tradeSlugs: [...new Set([...listedTrades, ...emtakCodes.flatMap((c) => tradesForActivity(c))])],
      foundedAt: null,
    });
  }
  return { rows, skipped };
}

function splitCsvLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}
