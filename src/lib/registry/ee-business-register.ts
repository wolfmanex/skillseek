// Company lookup in the Estonian e-Business Register (e-äriregister, run by RIK).
// Uses the public autocomplete endpoint behind ariregister.rik.ee search: free, no account needed.
// The contract-based XML service would give more detail (board members, EMTAK codes) if we need it later.

export type CompanyStatus = "active" | "liquidation" | "bankrupt" | "deleted" | "unknown";

export type RegistryCompany = {
  regCode: string;
  name: string;
  status: CompanyStatus;
  address: string | null;
  url: string;
};

const AUTOCOMPLETE_URL = "https://ariregister.rik.ee/est/api/autocomplete";

// Register status letters: R = entered in the register, L = in liquidation, N = bankrupt, K = deleted.
const STATUSES: Record<string, CompanyStatus> = { R: "active", L: "liquidation", N: "bankrupt", K: "deleted" };

export function companyUrl(regCode: string) {
  return `https://ariregister.rik.ee/est/company/${regCode}`;
}

/** Picks the company with exactly this registry code out of an autocomplete response. */
export function parseAutocomplete(json: unknown, regCode: string): RegistryCompany | null {
  const rows = (json as { data?: unknown })?.data;
  if (!Array.isArray(rows)) return null;
  for (const row of rows as Record<string, unknown>[]) {
    if (String(row?.reg_code ?? "") !== regCode) continue;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) return null;
    const address = [row.legal_address, row.zip_code].filter((v) => typeof v === "string" && v.trim()).join(", ");
    return {
      regCode,
      name,
      status: STATUSES[String(row.status ?? "").toUpperCase()] ?? "unknown",
      address: address || null,
      url: typeof row.url === "string" && row.url.startsWith("https://") ? row.url : companyUrl(regCode),
    };
  }
  return null;
}

/**
 * Looks a company up by registry code. Returns null when the register has no such company,
 * and throws when the register can't be reached, so callers can tell "not found" from "try later".
 */
export async function lookupEeCompany(regCode: string, fetchImpl: typeof fetch = fetch): Promise<RegistryCompany | null> {
  const res = await fetchImpl(`${AUTOCOMPLETE_URL}?q=${encodeURIComponent(regCode)}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Business register responded ${res.status}`);
  return parseAutocomplete(await res.json(), regCode);
}
