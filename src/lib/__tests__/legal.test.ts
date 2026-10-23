import { describe, expect, it } from "vitest";
import { en } from "../legal/en";
import { et } from "../legal/et";
import { fi } from "../legal/fi";
import type { LegalBlock, LegalDoc } from "../legal/types";
import { fillOperator, OPERATOR } from "../legal";

// The shape of a document: kind and size of every block, so translations can't drop a paragraph or list item.
const shape = (doc: LegalDoc) =>
  [doc.intro, ...doc.sections.map((s) => s.body)].map((blocks) =>
    blocks.map((b: LegalBlock) => (typeof b === "string" ? "p" : "list" in b ? `list${b.list.length}` : `table${b.table.rows.length}x${b.table.head.length}`)),
  );

const strings = (doc: LegalDoc) =>
  [doc.title, ...doc.intro, ...doc.sections.flatMap((s) => [s.heading, ...s.body])].flatMap((b) =>
    typeof b === "string" ? [b] : "list" in b ? b.list : [...b.table.head, ...b.table.rows.flat()],
  );

describe("legal texts", () => {
  it.each([
    ["Estonian", et],
    ["Finnish", fi],
  ])("%s matches the English structure", (_name, texts) => {
    expect(shape(texts.privacy)).toEqual(shape(en.privacy));
    expect(shape(texts.terms)).toEqual(shape(en.terms));
  });

  it("uses only known placeholders and no empty strings", () => {
    for (const texts of [en, et, fi]) {
      for (const s of [...strings(texts.privacy), ...strings(texts.terms)]) {
        expect(s.trim()).not.toBe("");
        expect(fillOperator(s)).not.toMatch(/\{\w+\}/);
      }
    }
  });

  it("names the operator and every subprocessor", () => {
    expect(fillOperator(en.privacy.sections[0].body[0] as string)).toContain(OPERATOR.company);
    const text = strings(en.privacy).join(" ");
    for (const name of ["Vercel", "Neon", "Resend", "Cloudflare"]) expect(text).toContain(name);
  });
});
