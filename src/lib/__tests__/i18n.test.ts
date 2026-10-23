import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }), headers: async () => new Headers() }));

import { en } from "../i18n/en";
import { et } from "../i18n/et";
import { fi } from "../i18n/fi";
import { localeFromAcceptLanguage, translator } from "../i18n";

describe("i18n", () => {
  it.each([
    ["Estonian", et],
    ["Finnish", fi],
  ])("has a %s string for every English key", (_name, dict) => {
    expect(Object.keys(dict).sort()).toEqual(Object.keys(en).sort());
    for (const value of Object.values(dict)) expect(value.trim()).not.toBe("");
  });

  it("keeps {placeholders} in every translation", () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const dict of [et, fi]) {
      for (const [key, value] of Object.entries(en)) expect(vars(dict[key as keyof typeof en])).toEqual(vars(value));
    }
  });

  it("interpolates variables", () => {
    expect(translator("et")("dash.hello", { name: "Mari" })).toBe("Tere, Mari");
    expect(translator("fi")("dash.hello", { name: "Mari" })).toBe("Hei, Mari");
  });

  it("picks the browser language from Accept-Language", () => {
    expect(localeFromAcceptLanguage("et-EE,et;q=0.9,en-US;q=0.8")).toBe("et");
    expect(localeFromAcceptLanguage("ru-RU,ru;q=0.9,fi;q=0.7,en;q=0.5")).toBe("fi");
    expect(localeFromAcceptLanguage("en;q=0.5,fi;q=0.8")).toBe("fi");
    expect(localeFromAcceptLanguage("de-DE,fr;q=0.9")).toBeUndefined();
    expect(localeFromAcceptLanguage("et;q=0,en")).toBe("en");
    expect(localeFromAcceptLanguage(null)).toBeUndefined();
  });
});
