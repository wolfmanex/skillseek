import Link from "next/link";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import { canPost } from "@/lib/matching";
import { getT } from "@/lib/i18n";
import { suggestedPostings } from "@/server/queries";
import { PostingCard, statusTone } from "@/components/posting-card";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";

const appTone = { PENDING: "stone", SHORTLISTED: "amber", ACCEPTED: "green", DECLINED: "red" } as const;

export default async function DashboardPage() {
  const user = await requireProfile();
  const { t, locale } = await getT();
  const isPro = user.role !== "CONTRACTOR";
  const poster = canPost(user.role);

  const [myPostings, myApplications, suggestions] = await Promise.all([
    poster
      ? db.posting.findMany({
          where: { authorId: user.id },
          include: { _count: { select: { applications: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [],
    isPro
      ? db.application.findMany({
          where: { applicantId: user.id },
          include: { posting: { include: { author: { include: { profile: true } } } } },
          orderBy: { updatedAt: "desc" },
        })
      : [],
    isPro ? suggestedPostings(user.id, 6) : [],
  ]);
  const invites = myApplications.filter((a) => a.source === "INVITED" && a.status === "PENDING");

  const missing = [
    user.profile.trades.length === 0 && t("dash.missing.trades"),
    !user.profile.county && t("dash.missing.county"),
    !user.profile.bio && t("dash.missing.bio"),
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dash.hello", { name: user.profile.displayName })}
        subtitle={t(`role.${user.role}`)}
        action={poster ? <ButtonLink href="/postings/new">{t("postings.new")}</ButtonLink> : undefined}
      />

      {missing.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <p className="text-sm">
            {t("dash.completeProfile")} {missing.join(", ")}.{" "}
            <Link href="/profile/edit" className="font-medium underline">{t("profile.editTitle")}</Link>
          </p>
        </Card>
      )}

      {invites.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("dash.invites")}</h2>
          <div className="space-y-2">
            {invites.map((a) => (
              <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{a.posting.title}</p>
                  <p className="text-xs text-stone-600">{a.posting.author.profile?.companyName || a.posting.author.profile?.displayName}</p>
                </div>
                <ButtonLink href={`/messages/${a.id}`}>{t("apply.openChat")}</ButtonLink>
              </Card>
            ))}
          </div>
        </section>
      )}

      {poster && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("dash.myPostings")}</h2>
          {myPostings.length === 0 ? (
            <Empty>{t("dash.noPostings")}</Empty>
          ) : (
            <Card className="divide-y divide-stone-100 p-0">
              {myPostings.map((p) => (
                <Link key={p.id} href={`/postings/${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-stone-50">
                  <span className="font-medium">{p.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-stone-600">
                    {t("owner.applicants", { count: p._count.applications })}
                    <Badge tone={statusTone(p.status)}>{t(`status.${p.status}`)}</Badge>
                  </span>
                </Link>
              ))}
            </Card>
          )}
        </section>
      )}

      {isPro && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("dash.suggested")}</h2>
          {suggestions.length === 0 ? (
            <Empty>{t("dash.noSuggestions")}</Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestions.map(({ posting, match }) => (
                <PostingCard key={posting.id} posting={posting} match={match} t={t} locale={locale} />
              ))}
            </div>
          )}
        </section>
      )}

      {isPro && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("dash.myApplications")}</h2>
          {myApplications.length === 0 ? (
            <Empty>{t("dash.noApplications")}</Empty>
          ) : (
            <Card className="divide-y divide-stone-100 p-0">
              {myApplications.map((a) => (
                <Link key={a.id} href={`/messages/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-stone-50">
                  <span>
                    <span className="block font-medium">{a.posting.title}</span>
                    <span className="block text-xs text-stone-500">{a.posting.author.profile?.companyName || a.posting.author.profile?.displayName}</span>
                  </span>
                  <Badge tone={appTone[a.status]}>{t(`appStatus.${a.status}`)}</Badge>
                </Link>
              ))}
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
