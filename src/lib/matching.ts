import type { Role, Seeking } from "@prisma/client";

export type MatchReason = "trade" | "location" | "available" | "certs" | "verified";

export type ProForMatch = {
  role: Role;
  tradeSlugs: string[];
  country: string | null;
  serviceCountries: string[];
  certifications: string[];
  available: boolean;
  availableFrom: Date | null;
  verified: boolean;
};

export type PostingForMatch = {
  seeking: Seeking;
  tradeSlugs: string[];
  country: string;
  startDate: Date | null;
  requiredCerts: string[];
};

export type MatchResult = { score: number; reasons: MatchReason[] };

const WEIGHTS = { trade: 40, location: 25, available: 15, certs: 15, verified: 5 };

export function canRespondTo(role: Role, seeking: Seeking) {
  if (role === "CONTRACTOR") return false;
  return seeking === "ANY" || seeking === role;
}

export function canPost(role: Role) {
  return role === "CONTRACTOR" || role === "SUBCONTRACTOR";
}

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Rule-based match score (0-100) between a pro and a posting.
 * Returns null when the pro can't take the posting at all (wrong role or no shared trade).
 */
export function scoreMatch(pro: ProForMatch, posting: PostingForMatch): MatchResult | null {
  if (!canRespondTo(pro.role, posting.seeking)) return null;

  const proTrades = new Set(pro.tradeSlugs);
  const shared = posting.tradeSlugs.filter((t) => proTrades.has(t));
  if (shared.length === 0) return null;

  const reasons: MatchReason[] = ["trade"];
  let score = WEIGHTS.trade * (shared.length / posting.tradeSlugs.length);

  if (pro.country === posting.country || pro.serviceCountries.includes(posting.country)) {
    score += WEIGHTS.location;
    reasons.push("location");
  }

  const freeInTime =
    pro.available &&
    (!pro.availableFrom || !posting.startDate || pro.availableFrom <= posting.startDate);
  if (freeInTime) {
    score += WEIGHTS.available;
    reasons.push("available");
  }

  if (posting.requiredCerts.length === 0) {
    score += WEIGHTS.certs;
  } else {
    const held = new Set(pro.certifications.map(norm));
    const covered = posting.requiredCerts.filter((c) => held.has(norm(c))).length;
    score += WEIGHTS.certs * (covered / posting.requiredCerts.length);
    if (covered === posting.requiredCerts.length) reasons.push("certs");
  }

  if (pro.verified) {
    score += WEIGHTS.verified;
    reasons.push("verified");
  }

  return { score: Math.round(score), reasons };
}
