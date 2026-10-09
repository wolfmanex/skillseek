import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

import { en } from "../i18n/en";
import { et } from "../i18n/et";
import { translator } from "../i18n";

describe("i18n", () => {
  it("has an Estonian string for every English key", () => {
    expect(Object.keys(et).sort()).toEqual(Object.keys(en).sort());
    for (const value of Object.values(et)) expect(value.trim()).not.toBe("");
  });

  it("interpolates variables", () => {
    expect(translator("et")("dash.hello", { name: "Mari" })).toBe("Tere, Mari");
  });
});
