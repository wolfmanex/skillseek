import { describe, expect, it } from "vitest";
import {
  JsonArraySplitter,
  parseCompanyCsv,
  parseRegistryCompany,
  parseRegistryDate,
  splitEhak,
  tradesForActivity,
} from "../company-import";

const record = {
  ariregistri_kood: 12345678,
  nimi: "Katusemeister OÜ",
  yldandmed: {
    staatus: "R",
    oiguslik_vorm: "OÜ",
    esmaregistreerimise_kpv: "05.03.2015",
    aadressid: [
      { ehak_nimetus: "Harju maakond, Tallinn, Lasnamäe linnaosa", tanav_maja_korter: "Vana 1", postiindeks: "11415", lopp_kpv: "01.01.2020" },
      { ehak_nimetus: "Harju maakond, Tallinn, Kesklinna linnaosa", tanav_maja_korter: "Uus 2-3", postiindeks: "10111" },
    ],
    sidevahendid: [
      { liik: "EMAIL", sisu: "old@example.ee", lopp_kpv: "01.01.2021" },
      { liik: "EMAIL", sisu: "Info@Katusemeister.ee" },
      { liik: "MOB", sisu: "+372 5555 5555" },
      { liik: "WWW", sisu: "www.katusemeister.ee" },
    ],
    teatatud_tegevusalad: [
      { emtak_kood: "43911", emtak_tekstina: "Katusetööd", on_pohitegevusala: true },
      { emtak_kood: "43221", emtak_tekstina: "Kütte- ja ventilatsioonisüsteemide paigaldus", on_pohitegevusala: false },
      { emtak_kood: "68201", emtak_tekstina: "Üürileandmine", on_pohitegevusala: false },
      { emtak_kood: "43211", emtak_tekstina: "Elektriinstallatsioon", on_pohitegevusala: false, lopp_kpv: "01.01.2019" },
    ],
  },
};

describe("parseRegistryCompany", () => {
  it("maps a construction firm from the general data dump", () => {
    expect(parseRegistryCompany(record)).toEqual({
      regCode: "12345678",
      name: "Katusemeister OÜ",
      legalForm: "OÜ",
      status: "R",
      address: "Uus 2-3, Harju maakond, Tallinn, Kesklinna linnaosa, 10111",
      county: "Harju maakond",
      city: "Tallinn",
      email: "info@katusemeister.ee",
      phone: "+372 5555 5555",
      website: "https://www.katusemeister.ee",
      emtakCodes: ["43911", "43221", "68201"],
      mainEmtak: "43911",
      tradeSlugs: ["roofing", "plumbing", "hvac"],
      foundedAt: new Date("2015-03-05T00:00:00Z"),
    });
  });

  it("skips firms without a current construction activity", () => {
    const y = record.yldandmed;
    expect(parseRegistryCompany({ ...record, yldandmed: { ...y, teatatud_tegevusalad: [y.teatatud_tegevusalad[2], y.teatatud_tegevusalad[3]] } })).toBeNull();
  });

  it("skips sole proprietors, deleted firms and bad codes", () => {
    expect(parseRegistryCompany({ ...record, yldandmed: { ...record.yldandmed, oiguslik_vorm: "FIE" } })).toBeNull();
    expect(parseRegistryCompany({ ...record, yldandmed: { ...record.yldandmed, staatus: "K" } })).toBeNull();
    expect(parseRegistryCompany({ ...record, ariregistri_kood: "123" })).toBeNull();
  });

  it("keeps firms in liquidation so their status can be updated", () => {
    expect(parseRegistryCompany({ ...record, yldandmed: { ...record.yldandmed, staatus: "L" } })?.status).toBe("L");
  });

  it("can require construction to be the main activity", () => {
    const y = record.yldandmed;
    const sideline = { ...record, yldandmed: { ...y, teatatud_tegevusalad: [{ ...y.teatatud_tegevusalad[0], on_pohitegevusala: false }] } };
    expect(parseRegistryCompany(sideline)).not.toBeNull();
    expect(parseRegistryCompany(sideline, { mainOnly: true })).toBeNull();
  });
});

describe("tradesForActivity", () => {
  it("uses the NACE class and the activity text", () => {
    expect(tradesForActivity("43211")).toEqual(["electrical"]);
    expect(tradesForActivity("43991", "Tellingute paigaldus")).toEqual(["scaffolding"]);
    expect(tradesForActivity("43910", "Müüritööd")).toEqual(["masonry"]);
    expect(tradesForActivity("43910")).toEqual(["roofing"]);
    expect(tradesForActivity("42111")).toEqual(["earthworks"]);
    expect(tradesForActivity("41201")).toEqual(["general-construction"]);
  });
});

describe("helpers", () => {
  it("parses register dates", () => {
    expect(parseRegistryDate("31.12.2020")).toEqual(new Date("2020-12-31T00:00:00Z"));
    expect(parseRegistryDate("")).toBeNull();
  });

  it("splits EHAK names", () => {
    expect(splitEhak("Tartu maakond, Tartu linn")).toEqual({ county: "Tartu maakond", city: "Tartu linn" });
  });
});

describe("JsonArraySplitter", () => {
  it("yields elements across arbitrary chunk boundaries", () => {
    const items = [{ a: 1, s: 'brace } and "quote" [' }, { b: [1, { c: 2 }] }, { d: "ü" }];
    const text = JSON.stringify(items, null, 1);
    for (const size of [1, 3, 7, 1000]) {
      const splitter = new JsonArraySplitter();
      const out: unknown[] = [];
      for (let i = 0; i < text.length; i += size) out.push(...splitter.push(text.slice(i, i + size)));
      expect(out).toEqual(items);
    }
  });
});

describe("parseCompanyCsv", () => {
  it("reads semicolon CSV with quoted fields", () => {
    const csv = '﻿reg_code;name;email;website;emtak;trades\n12345678;"Ehitus ""Kiire"" OÜ";A@B.EE;kiire.ee;43211;tiling\nbad;row;;;;\n';
    const { rows, skipped } = parseCompanyCsv(csv);
    expect(skipped).toBe(1);
    expect(rows[0]).toMatchObject({
      regCode: "12345678",
      name: 'Ehitus "Kiire" OÜ',
      email: "a@b.ee",
      website: "https://kiire.ee",
      tradeSlugs: ["tiling", "electrical"],
    });
  });
});
