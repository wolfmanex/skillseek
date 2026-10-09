import { db } from "@/lib/db";
import { scoreMatch, type MatchResult, type ProForMatch } from "@/lib/matching";
import type { Prisma } from "@prisma/client";

const proInclude = { trades: true, user: { select: { id: true, role: true } } } as const;
type ProfileWithTrades = Prisma.ProfileGetPayload<{ include: typeof proInclude }>;

export function toProForMatch(p: ProfileWithTrades): ProForMatch {
  return {
    role: p.user.role,
    tradeSlugs: p.trades.map((t) => t.slug),
    county: p.county,
    serviceCounties: p.serviceCounties,
    certifications: p.certifications,
    available: p.available,
    availableFrom: p.availableFrom,
    verified: p.verified,
  };
}

/** Loads an application only if `userId` is one of its two parties (applicant or posting owner). */
export async function getConversation(applicationId: string, userId: string) {
  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      posting: { include: { author: { include: { profile: true } } } },
      applicant: { include: { profile: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!application) return null;
  if (application.applicantId !== userId && application.posting.authorId !== userId) return null;
  return application;
}

export async function ratingsFor(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, { avg: number; count: number }>();
  const rows = await db.review.groupBy({
    by: ["subjectId"],
    where: { subjectId: { in: userIds } },
    _avg: { rating: true },
    _count: true,
  });
  return new Map(rows.map((r) => [r.subjectId, { avg: r._avg.rating ?? 0, count: r._count }]));
}

/** Best-matching pros for a posting, excluding people already applied or invited. */
export async function suggestedPros(postingId: string, limit = 8) {
  const posting = await db.posting.findUnique({
    where: { id: postingId },
    include: { trades: true, applications: { select: { applicantId: true } } },
  });
  if (!posting) return [];
  const exclude = [posting.authorId, ...posting.applications.map((a) => a.applicantId)];
  const candidates = await db.profile.findMany({
    where: {
      userId: { notIn: exclude },
      user: { role: posting.seeking === "ANY" ? { not: "CONTRACTOR" } : posting.seeking },
      trades: { some: { id: { in: posting.trades.map((t) => t.id) } } },
    },
    include: proInclude,
    take: 200,
  });
  const forMatch = {
    seeking: posting.seeking,
    tradeSlugs: posting.trades.map((t) => t.slug),
    county: posting.county,
    startDate: posting.startDate,
    requiredCerts: posting.requiredCerts,
  };
  return candidates
    .map((profile) => ({ profile, match: scoreMatch(toProForMatch(profile), forMatch) }))
    .filter((r): r is { profile: ProfileWithTrades; match: MatchResult } => r.match !== null)
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);
}

/** Open postings that best fit a pro, excluding ones they're already on. */
export async function suggestedPostings(userId: string, limit = 8) {
  const profile = await db.profile.findUnique({ where: { userId }, include: proInclude });
  if (!profile || profile.user.role === "CONTRACTOR") return [];
  const postings = await db.posting.findMany({
    where: {
      status: "OPEN",
      authorId: { not: userId },
      seeking: { in: ["ANY", profile.user.role] },
      trades: { some: { id: { in: profile.trades.map((t) => t.id) } } },
      applications: { none: { applicantId: userId } },
    },
    include: { trades: true, author: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const pro = toProForMatch(profile);
  return postings
    .map((posting) => ({
      posting,
      match: scoreMatch(pro, {
        seeking: posting.seeking,
        tradeSlugs: posting.trades.map((t) => t.slug),
        county: posting.county,
        startDate: posting.startDate,
        requiredCerts: posting.requiredCerts,
      }),
    }))
    .filter((r): r is typeof r & { match: MatchResult } => r.match !== null)
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);
}
