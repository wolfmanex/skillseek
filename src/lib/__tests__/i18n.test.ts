import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

import { en } from "../i18n/en";
import { et } from "../i18n/et";
import { fi } from "../i18n/fi";
import { translator } from "../i18n";

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
});
