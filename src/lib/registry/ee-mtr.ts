// Check in the Estonian Register of Economic Activities (majandustegevuse register, MTR, run by TTJA).
// Construction firms must file a notice of economic activity there for most building work.
// MTR has no API, so this drives the public search form: GET the form for a session cookie and
// CSRF token, POST the registry code filter, then read the results and the company's detail page.
// It is best effort: any surprise in the HTML gives "unknown" rather than a wrong answer.

export type MtrStatus = "registered" | "not_found" | "unknown";

export type MtrResult = {
  status: MtrStatus;
  /** Construction-related activity fields found on the company's MTR page. */
  activities: string[];
  url: string;
};

const BASE = "https://mtr.ttja.ee";
export const MTR_SEARCH_URL = `${BASE}/juriidiline_isik?m=96`;

const CONSTRUCTION = /ehit|projekteeri|omanikujärelevalve|elektri|gaasi|soojus|vee- ja kanal|küttesüsteem|energiaaudit|tuleohutus/i;

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

export function parseCsrfToken(html: string) {
  const input = html.match(/<input[^>]*name="juriidiline_isik_filters\[_csrf_token\]"[^>]*>/i)?.[0];
  return input?.match(/value="([^"]*)"/i)?.[1] ?? null;
}

/** Finds the detail page link for the result row that carries this registry code, if any. */
export function parseResultLink(html: string, regCode: string) {
  const list = html.match(/class="[^"]*sf_admin_list[^"]*"[\s\S]*/i)?.[0];
  if (!list) return undefined; // not a results page: we can't tell
  for (const row of list.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
    if (!decode(row).includes(regCode)) continue;
    const href = row.match(/href="(\/juriidiline_isik\/\d+)[^"]*"/i)?.[1];
    return href ? `${BASE}${href}` : null;
  }
  return null;
}

/** Collects distinct construction-related table cells from a company's MTR detail page. */
export function parseActivities(html: string) {
  const cells = (html.match(/<td[^>]*>[\s\S]*?<\/td>/gi) ?? []).map(decode);
  return [...new Set(cells.filter((c) => c.length < 200 && CONSTRUCTION.test(c)))].slice(0, 12);
}

type Cookies = Map<string, string>;

function keepCookies(res: Response, jar: Cookies) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
}

const cookieHeader = (jar: Cookies) => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

export async function checkEeMtr(regCode: string, fetchImpl: typeof fetch = fetch): Promise<MtrResult> {
  const unknown: MtrResult = { status: "unknown", activities: [], url: MTR_SEARCH_URL };
  const jar: Cookies = new Map();
  const get = async (url: string) => {
    const res = await fetchImpl(url, { headers: { cookie: cookieHeader(jar) }, signal: AbortSignal.timeout(8000), cache: "no-store" });
    keepCookies(res, jar);
    if (!res.ok) throw new Error(`MTR responded ${res.status}`);
    return res.text();
  };

  try {
    const token = parseCsrfToken(await get(MTR_SEARCH_URL));
    if (!token) return unknown;

    const body = new URLSearchParams({
      "juriidiline_isik_filters[registrikood][text]": regCode,
      "juriidiline_isik_filters[_csrf_token]": token,
    });
    const post = await fetchImpl(`${BASE}/juriidiline_isik/filter/action`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", cookie: cookieHeader(jar) },
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    keepCookies(post, jar);

    const link = parseResultLink(await get(`${BASE}/juriidiline_isik`), regCode);
    if (link === undefined) return unknown;
    if (link === null) return { ...unknown, status: "not_found" };
    return { status: "registered", activities: parseActivities(await get(link)), url: link };
  } catch {
    return unknown;
  }
}
