import { describe, expect, it, vi } from "vitest";
import { isValidEeRegCode, normalizeRegCode } from "../registry/ee-regcode";
import { lookupEeCompany, parseAutocomplete } from "../registry/ee-business-register";
import { checkEeMtr, parseActivities, parseCsrfToken, parseResultLink } from "../registry/ee-mtr";

describe("Estonian registry codes", () => {
  it("accepts codes with a valid check digit", () => {
    expect(isValidEeRegCode("10060701")).toBe(true);
    expect(isValidEeRegCode("10137319")).toBe(true); // check digit from the second weight round
  });

  it("rejects wrong check digits and lengths", () => {
    expect(isValidEeRegCode("10060702")).toBe(false);
    expect(isValidEeRegCode("1006070")).toBe(false);
    expect(isValidEeRegCode("1006070a")).toBe(false);
  });

  it("strips spaces and dashes", () => {
    expect(normalizeRegCode(" 1006 0701 ")).toBe("10060701");
    expect(normalizeRegCode("10-06-07-01")).toBe("10060701");
  });
});

const autocomplete = {
  status: "OK",
  data: [
    { reg_code: 10060702, name: "Other OÜ", status: "R" },
    {
      company_id: 1,
      reg_code: 10060701,
      name: "Ehitus AS ",
      status: "R",
      legal_address: "Harju maakond, Tallinn, Ehitajate tee 1",
      zip_code: "10111",
      url: "https://ariregister.rik.ee/est/company/10060701/Ehitus-AS",
    },
  ],
};

describe("Business Register lookup", () => {
  it("picks the exact registry code and maps the status", () => {
    expect(parseAutocomplete(autocomplete, "10060701")).toEqual({
      regCode: "10060701",
      name: "Ehitus AS",
      status: "active",
      address: "Harju maakond, Tallinn, Ehitajate tee 1, 10111",
      url: "https://ariregister.rik.ee/est/company/10060701/Ehitus-AS",
    });
  });

  it("maps liquidation and unknown statuses", () => {
    const row = (status: string) => ({ data: [{ reg_code: "10060701", name: "X OÜ", status }] });
    expect(parseAutocomplete(row("L"), "10060701")?.status).toBe("liquidation");
    expect(parseAutocomplete(row("K"), "10060701")?.status).toBe("deleted");
    expect(parseAutocomplete(row("?"), "10060701")?.status).toBe("unknown");
  });

  it("returns null when nothing matches or the shape is unexpected", () => {
    expect(parseAutocomplete({ data: [] }, "10060701")).toBeNull();
    expect(parseAutocomplete({ error: "x" }, "10060701")).toBeNull();
    expect(parseAutocomplete(null, "10060701")).toBeNull();
  });

  it("throws when the register is down, so callers can tell it from not found", async () => {
    const down = vi.fn(async () => new Response("", { status: 503 }));
    await expect(lookupEeCompany("10060701", down as unknown as typeof fetch)).rejects.toThrow();
  });
});

const form = `<form><input type="hidden" name="juriidiline_isik_filters[_csrf_token]" value="abc123" id="x"/></form>`;
const results = (rows: string) => `<div class="sf_admin_list"><table><tbody>${rows}</tbody></table></div>`;
const hit = `<tr><td><a href="/juriidiline_isik/4242">Ehitus AS</a></td><td>10060701</td></tr>`;
const detail = `<table><tr><td>Ehitamine</td><td>Üldehitustööd</td></tr><tr><td>Toitlustamine</td></tr>
  <tr><td>Elektritööd</td><td>Ehitusprojekti koostamine</td></tr></table>`;

describe("MTR check", () => {
  it("parses the CSRF token, result link and construction activities", () => {
    expect(parseCsrfToken(form)).toBe("abc123");
    expect(parseResultLink(results(hit), "10060701")).toBe("https://mtr.ttja.ee/juriidiline_isik/4242");
    expect(parseResultLink(results(""), "10060701")).toBeNull();
    expect(parseResultLink("<html>maintenance</html>", "10060701")).toBeUndefined();
    expect(parseActivities(detail)).toEqual(["Ehitamine", "Üldehitustööd", "Elektritööd", "Ehitusprojekti koostamine"]);
  });

  it("runs the form flow with the session cookie", async () => {
    const calls: { url: string; cookie: string }[] = [];
    const fake = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, cookie: new Headers(init?.headers).get("cookie") ?? "" });
      if (url.endsWith("?m=96")) return new Response(form, { headers: { "set-cookie": "mtr=s1; path=/" } });
      if (url.endsWith("/filter/action")) return new Response(null, { status: 302 });
      if (url.endsWith("/juriidiline_isik")) return new Response(results(hit));
      return new Response(detail);
    });
    const result = await checkEeMtr("10060701", fake as unknown as typeof fetch);
    expect(result.status).toBe("registered");
    expect(result.activities).toContain("Ehitamine");
    expect(calls.slice(1).every((c) => c.cookie === "mtr=s1")).toBe(true);
  });

  it("gives unknown instead of throwing when MTR fails", async () => {
    const boom = vi.fn(async () => {
      throw new Error("network");
    });
    expect((await checkEeMtr("10060701", boom as unknown as typeof fetch)).status).toBe("unknown");
  });
});
