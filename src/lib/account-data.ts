import { db } from "@/lib/db";
import { photoUrl, storageEnabled } from "@/lib/storage";

/**
 * Personal data export (GDPR articles 15 and 20). Fields are picked one by one,
 * so secrets such as the password hash, session ids and sign-in token hashes
 * never end up in the file.
 */
export async function loadAccountData(userId: string) {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      profile: { include: { trades: true } },
      sessions: true,
      loginTokens: true,
      postings: { include: { trades: true } },
      applications: { include: { posting: { select: { id: true, title: true } } } },
      reviewsWritten: true,
      reviewsGot: true,
    },
  });
  // Every conversation the user is part of: as the applicant, or as the author of the posting.
  const messages = await db.message.findMany({
    where: { application: { OR: [{ applicantId: userId }, { posting: { authorId: userId } }] } },
    orderBy: { createdAt: "asc" },
  });
  return { user, messages };
}

export type AccountData = Awaited<ReturnType<typeof loadAccountData>>;

const slugs = (trades: { slug: string }[]) => trades.map((t) => t.slug);

export function buildExport({ user, messages }: AccountData, exportedAt = new Date()) {
  const p = user.profile;
  return {
    exportedAt: exportedAt.toISOString(),
    service: "Skillseek (Wolfman OÜ)",
    account: {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      locale: user.locale,
      createdAt: user.createdAt,
    },
    profile: p && {
      displayName: p.displayName,
      companyName: p.companyName,
      regCode: p.regCode,
      bio: p.bio,
      phone: p.phone,
      website: p.website,
      country: p.country,
      serviceCountries: p.serviceCountries,
      trades: slugs(p.trades),
      certifications: p.certifications,
      portfolioUrls: p.portfolioUrls,
      photos: p.photoKeys.map((key) => (storageEnabled() ? photoUrl(key) : key)),
      yearsExperience: p.yearsExperience,
      hourlyRate: p.hourlyRate,
      available: p.available,
      availableFrom: p.availableFrom,
      verified: p.verified,
      updatedAt: p.updatedAt,
    },
    postings: user.postings.map((x) => ({
      id: x.id,
      title: x.title,
      description: x.description,
      country: x.country,
      city: x.city,
      startDate: x.startDate,
      endDate: x.endDate,
      budgetMin: x.budgetMin,
      budgetMax: x.budgetMax,
      seeking: x.seeking,
      trades: slugs(x.trades),
      requiredCerts: x.requiredCerts,
      status: x.status,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    })),
    applications: user.applications.map((a) => ({
      id: a.id,
      posting: a.posting,
      message: a.message,
      status: a.status,
      source: a.source,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    })),
    // Messages in the user's conversations. Other people are not named: "sentByMe" is enough to read the thread.
    messages: messages.map((m) => ({
      conversation: m.applicationId,
      sentByMe: m.senderId === user.id,
      body: m.body,
      readAt: m.readAt,
      createdAt: m.createdAt,
    })),
    reviewsWritten: user.reviewsWritten.map((r) => ({
      posting: r.postingId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    reviewsReceived: user.reviewsGot.map((r) => ({
      posting: r.postingId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    sessions: user.sessions.map((s) => ({ createdAt: s.createdAt, expiresAt: s.expiresAt })),
    signInLinks: user.loginTokens.map((l) => ({ createdAt: l.createdAt, expiresAt: l.expiresAt, usedAt: l.usedAt })),
  };
}
