export type FormState = { error?: string; ok?: string } | undefined;

export function str(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function optStr(form: FormData, key: string) {
  return str(form, key) || null;
}

export function optInt(form: FormData, key: string) {
  const v = str(form, key);
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function optDate(form: FormData, key: string) {
  const v = str(form, key);
  if (!v) return null;
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function list(form: FormData, key: string) {
  return form.getAll(key).filter((v): v is string => typeof v === "string" && v !== "");
}

// Splits a textarea into trimmed, non-empty, de-duplicated lines (commas also separate).
export function lines(form: FormData, key: string) {
  return [...new Set(str(form, key).split(/[\n,]/).map((s) => s.trim()).filter(Boolean))];
}
