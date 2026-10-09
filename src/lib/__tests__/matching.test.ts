import { describe, expect, it } from "vitest";
import { canPost, canRespondTo, scoreMatch, type PostingForMatch, type ProForMatch } from "../matching";

const pro: ProForMatch = {
  role: "SUBCONTRACTOR",
  tradeSlugs: ["electrical"],
  county: "harju",
  serviceCounties: ["harju", "rapla"],
  certifications: ["Electrician level 5"],
  available: true,
  availableFrom: null,
  verified: true,
};

const posting: PostingForMatch = {
  seeking: "SUBCONTRACTOR",
  tradeSlugs: ["electrical"],
  county: "harju",
  startDate: new Date("2026-11-01"),
  requiredCerts: ["electrician LEVEL 5"],
};

describe("roles", () => {
  it("only contractors and subcontractors can post", () => {
    expect(canPost("CONTRACTOR")).toBe(true);
    expect(canPost("SUBCONTRACTOR")).toBe(true);
    expect(canPost("SPECIALIST")).toBe(false);
  });

  it("contractors never respond to postings", () => {
    expect(canRespondTo("CONTRACTOR", "ANY")).toBe(false);
    expect(canRespondTo("SPECIALIST", "ANY")).toBe(true);
    expect(canRespondTo("SPECIALIST", "SUBCONTRACTOR")).toBe(false);
  });
});

describe("scoreMatch", () => {
  it("gives a perfect match 100 with all reasons", () => {
    expect(scoreMatch(pro, posting)).toEqual({
      score: 100,
      reasons: ["trade", "location", "available", "certs", "verified"],
    });
  });

  it("excludes pros without a shared trade or with the wrong role", () => {
    expect(scoreMatch({ ...pro, tradeSlugs: ["plumbing"] }, posting)).toBeNull();
    expect(scoreMatch({ ...pro, role: "SPECIALIST" }, posting)).toBeNull();
  });

  it("scores partial trade coverage proportionally", () => {
    const result = scoreMatch(pro, { ...posting, tradeSlugs: ["electrical", "hvac"] });
    expect(result?.score).toBe(80);
  });

  it("drops location points outside the pro's counties", () => {
    const result = scoreMatch(pro, { ...posting, county: "tartu" });
    expect(result?.score).toBe(75);
    expect(result?.reasons).not.toContain("location");
  });

  it("treats a pro free only after the start date as unavailable", () => {
    const result = scoreMatch({ ...pro, availableFrom: new Date("2026-12-01") }, posting);
    expect(result?.reasons).not.toContain("available");
    expect(result?.score).toBe(85);
  });

  it("gives partial certificate credit", () => {
    const result = scoreMatch(pro, { ...posting, requiredCerts: ["Electrician level 5", "Working at height"] });
    expect(result?.score).toBe(93);
    expect(result?.reasons).not.toContain("certs");
  });
});
