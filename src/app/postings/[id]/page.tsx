import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { countryName } from "@/lib/constants";
import { canRespondTo } from "@/lib/matching";
import { STATUS_FLOW } from "@/lib/postings";
import { formatDate, getT, tradeName, type Locale, type T } from "@/lib/i18n";
import { applyToPosting, invitePro, setApplicationStatus, setPostingStatus } from "@/server/posting-actions";
import { leaveReview } from "@/server/review-actions";
import { ratingsFor, suggestedPros } from "@/server/queries";
import { ActionForm, SubmitButton } from "@/components/forms";
import { budgetText, statusTone } from "@/components/posting-card";
import { ProCard } from "@/components/pro-card";
import { Badge, ButtonLink, Card, Empty, btnCls, btnSecondaryCls, inputCls } from "@/components/ui";

const appTone = { PENDING: "stone", SHORTLISTED: "amber", ACCEPTED: "green", DECLINED: "red" } as const;

export default async function PostingPage({ params }: PageProps<"/postings/[id]">) {
  const { id } = await params;
  const { t, locale } = await getT();
  const viewer = await getCurrentUser();
  const posting = await db.posting.findUnique({
    where: { id },
    include: {
      trades: true,
      author: { include: { profile: true } },
      applications: {
        include: { applicant: { include: { profile: { include: { trades: true } } } } },
        orderBy: { createdAt: "asc" },
      },
      reviews: true,
    },
  });
  if (!posting) notFound();

  const isOwner = viewer?.id === posting.authorId;
  const myApplication = viewer ? posting.applications.find((a) => a.applicantId === viewer.id) : undefined;
  const author = posting.author.profile;

  const facts: [string, string][] = [
    [t("profile.country"), `${countryName(posting.country, locale)}${posting.city ? `, ${posting.city}` : ""}`],
    [t("posting.budget"), budgetText(posting, locale, t)],
    [t("posting.seeking"), t(`seeking.${posting.seeking}`)],
  ];
  if (posting.startDate) facts.push([t("posting.startDate"), formatDate(posting.startDate, locale)]);
  if (posting.endDate) facts.push([t("posting.endDate"), formatDate(posting.endDate, locale)]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{posting.title}</h1>
            <Badge tone={statusTone(posting.status)}>{t(`status.${posting.status}`)}</Badge>
          </div>
          <p className="mt-1 text-sm text-stone-600">
            {t("posting.postedBy")}{" "}
            <Link href={`/pros/${posting.authorId}`} className="font-medium underline">{author?.companyName || author?.displayName}</Link>
            {" · "}{formatDate(posting.createdAt, locale)}
          </p>
          <div className="mt-4 flex flex-wrap gap-1">
            {posting.trades.map((tr) => <Badge key={tr.id} tone="amber">{tradeName(tr, locale)}</Badge>)}
          </div>
          <p className="mt-4 whitespace-pre-line text-sm text-stone-800">{posting.description}</p>
          {posting.requiredCerts.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold">{t("posting.requiredCerts")}</h2>
              <ul className="mt-1 list-inside list-disc text-sm text-stone-700">
                {posting.requiredCerts.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
        </Card>

        {isOwner && <OwnerPanel postingId={posting.id} status={posting.status} applications={posting.applications} t={t} />}
        {isOwner && posting.status === "OPEN" && <SuggestedPros postingId={posting.id} t={t} locale={locale} />}
        {posting.status === "COMPLETED" && viewer && (
          <ReviewPanel
            postingId={posting.id}
            viewerId={viewer.id}
            ownerId={posting.authorId}
            ownerName={author?.companyName || author?.displayName || ""}
            accepted={posting.applications.filter((a) => a.status === "ACCEPTED")}
            reviews={posting.reviews}
            t={t}
          />
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <dl className="space-y-2 text-sm">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-stone-500">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {!viewer && (
          <Card>
            <p className="text-sm text-stone-600">{t("posting.loginToApply")}</p>
            <div className="mt-3"><ButtonLink href="/signup">{t("nav.signup")}</ButtonLink></div>
          </Card>
        )}

        {viewer && !isOwner && myApplication && (
          <Card className="space-y-3">
            <p className="text-sm">
              {myApplication.source === "INVITED" ? t("apply.invited") : t("apply.applied")}{" "}
              <Badge tone={appTone[myApplication.status]}>{t(`appStatus.${myApplication.status}`)}</Badge>
            </p>
            <ButtonLink href={`/messages/${myApplication.id}`}>{t("apply.openChat")}</ButtonLink>
          </Card>
        )}

        {viewer && !isOwner && !myApplication && posting.status === "OPEN" && (
          canRespondTo(viewer.role, posting.seeking) ? (
            viewer.profile ? (
              <Card>
                <h2 className="mb-3 font-semibold">{t("apply.title")}</h2>
                <ActionForm action={applyToPosting} className="space-y-3">
                  <input type="hidden" name="postingId" value={posting.id} />
                  <textarea name="message" rows={5} required placeholder={t("apply.placeholder")} className={inputCls} />
                  <SubmitButton>{t("apply.submit")}</SubmitButton>
                </ActionForm>
              </Card>
            ) : (
              <Card><ButtonLink href="/profile/edit">{t("profile.createTitle")}</ButtonLink></Card>
            )
          ) : (
            <Card><p className="text-sm text-stone-600">{t("apply.error.notEligible")}</p></Card>
          )
        )}
      </div>
    </div>
  );
}

type AppWithProfile = Prisma.ApplicationGetPayload<{
  include: { applicant: { include: { profile: { include: { trades: true } } } } };
}>;

function OwnerPanel({ postingId, status, applications, t }: { postingId: string; status: keyof typeof STATUS_FLOW; applications: AppWithProfile[]; t: T }) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{t("owner.applicants", { count: applications.length })}</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW[status].map((next) => (
            <form key={next} action={setPostingStatus}>
              <input type="hidden" name="postingId" value={postingId} />
              <input type="hidden" name="status" value={next} />
              <button className={btnSecondaryCls}>{t(`owner.to.${next}`)}</button>
            </form>
          ))}
        </div>
      </div>
      {applications.length === 0 ? (
        <Empty>{t("owner.noApplicants")}</Empty>
      ) : (
        <ul className="divide-y divide-stone-100">
          {applications.map((a) => {
            const p = a.applicant.profile;
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link href={`/pros/${a.applicantId}`} className="font-medium hover:underline">{p?.companyName || p?.displayName}</Link>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                    <Badge tone={appTone[a.status]}>{t(`appStatus.${a.status}`)}</Badge>
                    <span className="text-stone-500">{a.source === "INVITED" ? t("owner.invited") : t("owner.applied")}</span>
                    {p?.verified && <Badge tone="green">✓ {t("pro.verified")}</Badge>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["SHORTLISTED", "ACCEPTED", "DECLINED"] as const)
                    .filter((s) => s !== a.status)
                    .map((s) => (
                      <form key={s} action={setApplicationStatus}>
                        <input type="hidden" name="applicationId" value={a.id} />
                        <input type="hidden" name="status" value={s} />
                        <button className="rounded border border-stone-300 px-2 py-1 text-xs hover:bg-stone-50">{t(`owner.do.${s}`)}</button>
                      </form>
                    ))}
                  <Link href={`/messages/${a.id}`} className="rounded bg-stone-900 px-2 py-1 text-xs font-medium text-white hover:bg-stone-700">
                    {t("owner.chat")}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

async function SuggestedPros({ postingId, t, locale }: { postingId: string; t: T; locale: Locale }) {
  const suggestions = await suggestedPros(postingId);
  const ratings = await ratingsFor(suggestions.map((s) => s.profile.userId));
  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold">{t("owner.suggested")}</h2>
      <p className="mb-3 text-sm text-stone-600">{t("owner.suggestedHint")}</p>
      {suggestions.length === 0 ? (
        <Empty>{t("owner.noSuggestions")}</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {suggestions.map(({ profile, match }) => (
            <ProCard key={profile.id} profile={profile} role={profile.user.role} match={match} rating={ratings.get(profile.userId)} t={t} locale={locale}>
              <form action={invitePro}>
                <input type="hidden" name="postingId" value={postingId} />
                <input type="hidden" name="proId" value={profile.userId} />
                <button className={btnCls}>{t("pro.sendInvite")}</button>
              </form>
            </ProCard>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewPanel({
  postingId,
  viewerId,
  ownerId,
  ownerName,
  accepted,
  reviews,
  t,
}: {
  postingId: string;
  viewerId: string;
  ownerId: string;
  ownerName: string;
  accepted: AppWithProfile[];
  reviews: { authorId: string; subjectId: string; rating: number; comment: string }[];
  t: T;
}) {
  const subjects =
    viewerId === ownerId
      ? accepted.map((a) => ({ id: a.applicantId, name: a.applicant.profile?.companyName || a.applicant.profile?.displayName || "" }))
      : accepted.some((a) => a.applicantId === viewerId)
        ? [{ id: ownerId, name: ownerName }]
        : [];
  if (subjects.length === 0) return null;

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">{t("review.title")}</h2>
      {subjects.map((s) => {
        const existing = reviews.find((r) => r.authorId === viewerId && r.subjectId === s.id);
        return (
          <form key={s.id} action={leaveReview} className="space-y-2 border-t border-stone-100 pt-3 first:border-0 first:pt-0">
            <input type="hidden" name="postingId" value={postingId} />
            <input type="hidden" name="subjectId" value={s.id} />
            <p className="text-sm font-medium">{s.name}</p>
            <select name="rating" defaultValue={existing?.rating ?? 5} className={`${inputCls} max-w-40`}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
            </select>
            <textarea name="comment" rows={2} defaultValue={existing?.comment} placeholder={t("review.placeholder")} className={inputCls} />
            <button className={btnSecondaryCls}>{existing ? t("review.update") : t("review.submit")}</button>
          </form>
        );
      })}
    </Card>
  );
}
