import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const COLUMNS = [
  "createdAt", "email", "name", "role", "companyName", "regCode", "phone",
  "region", "trades", "message", "locale", "source", "invitedAt",
] as const;

function cell(value: unknown) {
  const s = value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.join(" ") : String(value ?? "");
  // Quote every cell, and stop spreadsheet apps from running cells as formulas.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replaceAll('"', '""')}"`;
}

export async function GET() {
  await requireAdmin();
  const entries = await db.waitlistEntry.findMany({ orderBy: { createdAt: "asc" } });
  const rows = [COLUMNS.join(","), ...entries.map((e) => COLUMNS.map((c) => cell(e[c])).join(","))];
  return new Response(`﻿${rows.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="skillseek-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
