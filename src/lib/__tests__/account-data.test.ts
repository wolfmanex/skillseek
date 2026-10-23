import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));

import { buildExport, type AccountData } from "../account-data";

const at = new Date("2026-10-01T10:00:00Z");

const data = {
  user: {
    id: "u1",
    email: "mari@example.com",
    passwordHash: "$2a$10$secret-hash",
    role: "SUBCONTRACTOR",
    isAdmin: false,
    locale: "et",
    createdAt: at,
    profile: {
      id: "p1",
      userId: "u1",
      displayName: "Mari",
      companyName: "Mari Ehitus OÜ",
      regCode: "12345678",
      bio: "",
      phone: null,
      website: null,
      country: "EE",
      serviceCountries: ["EE"],
      certifications: [],
      portfolioUrls: [],
      photoKeys: ["profiles/u1/a.jpg"],
      yearsExperience: 5,
      hourlyRate: 40,
      available: true,
      availableFrom: null,
      verified: false,
      updatedAt: at,
      trades: [{ id: "t1", slug: "tiling", nameEn: "Tiling", nameEt: "Plaatimine", nameFi: "Laatoitus" }],
    },
    sessions: [{ id: "session-secret", userId: "u1", expiresAt: at, createdAt: at }],
    loginTokens: [{ tokenHash: "token-secret", userId: "u1", expiresAt: at, usedAt: null, createdAt: at }],
    postings: [],
    applications: [],
    reviewsWritten: [],
    reviewsGot: [{ id: "r1", postingId: "x1", authorId: "u2", subjectId: "u1", rating: 5, comment: "Great", createdAt: at }],
  },
  messages: [
    { id: "m1", applicationId: "a1", senderId: "u1", body: "Hi", readAt: null, createdAt: at },
    { id: "m2", applicationId: "a1", senderId: "u2", body: "Hello", readAt: null, createdAt: at },
  ],
} as unknown as AccountData;

describe("buildExport", () => {
  const out = buildExport(data, at);
  const json = JSON.stringify(out);

  it("leaves out secrets", () => {
    for (const secret of ["secret-hash", "session-secret", "token-secret"]) expect(json).not.toContain(secret);
  });

  it("includes the user's own data", () => {
    expect(out.account.email).toBe("mari@example.com");
    expect(out.profile?.trades).toEqual(["tiling"]);
    expect(out.reviewsReceived).toHaveLength(1);
    expect(out.sessions).toHaveLength(1);
  });

  it("marks who sent each message without naming the other party", () => {
    expect(out.messages.map((m) => m.sentByMe)).toEqual([true, false]);
    expect(json).not.toContain("u2");
  });
});
