import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { countyName } from "@/lib/constants";
import { canPost, canRespondTo } from "@/lib/matching";
import { formatDate, formatEuro, getT, tradeName } from "@/lib/i18n";
import { invitePro } from "@/server/posting-actions";
import { photoUrl } from "@/lib/storage";
import { Badge, ButtonLink, Card, Empty, Stars, btnSecondaryCls, inputCls } from "@/components/ui";

export default async function ProPage({ params }: PageProps<"/pros/[id]">) {
  const { id } = await params;
  const { t, locale } = await getT();
  const viewer = await getCurrentUser();
  const user = await db.user.findUnique({
    where: { id },
    include: {
      profile: { include: { trades: true } },
      reviewsGot: { include: { author: { include: { profile: true } }, posting: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!user?.profile) notFound();
  const p = user.profile;
  const isMe = viewer?.id === user.id;
  const reviews = user.reviewsGot;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  // Contractors viewing a pro can invite them to one of their open postings.
  const invitable =
    viewer && !isMe && canPost(viewer.role) && user.role !== "CONTRACTOR"
      ? (
          await db.posting.findMany({
            where: { authorId: viewer.id, status: "OPEN", applications: { none: { applicantId: user.id } } },
            orderBy: { createdAt: "desc" },
          })
        ).filter((post) => canRespondTo(user.role, post.seeking))
      : [];

  const facts: [string, string][] = [];
  if (p.companyName) facts.push([t("profile.contactName"), p.displayName]);
  if (p.regCode) facts.push([t("profile.regCode"), p.regCode]);
  if (p.county) facts.push([t("profile.county"), countyName(p.county)]);
  if (p.yearsExperience != null) facts.push([t("profile.years"), String(p.yearsExperience)]);
  if (p.hourlyRate != null) facts.push([t("profile.rate"), formatEuro(p.hourlyRate, locale)]);
  if (p.availableFrom) facts.push([t("profile.availableFrom"), formatDate(p.availableFrom, locale)]);
  if (viewer && p.phone) facts.push([t("profile.phone"), p.phone]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{p.companyName || p.displayName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <Badge tone={user.role === "SPECIALIST" ? "blue" : "stone"}>{t(`role.${user.role}`)}</Badge>
                {p.verified && <Badge tone="green">✓ {t("pro.verified")}</Badge>}
                {user.role !== "CONTRACTOR" && (
                  <span className={p.available ? "text-green-700" : "text-stone-500"}>
                    {p.available ? t("pro.available") : t("pro.unavailable")}
                  </span>
                )}
                {reviews.length > 0 && <span><Stars value={avg} /> ({reviews.length})</span>}
              </div>
            </div>
            {isMe && <ButtonLink href="/profile/edit" secondary>{t("profile.editTitle")}</ButtonLink>}
          </div>
          {p.bio && <p className="mt-4 whitespace-pre-line text-sm text-stone-700">{p.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-1">
            {p.trades.map((tr) => <Badge key={tr.id} tone="amber">{tradeName(tr, locale)}</Badge>)}
          </div>
        </Card>

        {p.photoKeys.length > 0 && (
          <Card>
            <h2 className="mb-3 font-semibold">{t("photos.title")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.photoKeys.map((key) => (
                <a key={key} href={photoUrl(key)} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl(key)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
                </a>
              ))}
            </div>
          </Card>
        )}

        {(p.certifications.length > 0 || p.portfolioUrls.length > 0) && (
          <Card className="space-y-4">
            {p.certifications.length > 0 && (
              <div>
                <h2 className="mb-2 font-semibold">{t("profile.certifications")}</h2>
                <ul className="list-inside list-disc text-sm text-stone-700">
                  {p.certifications.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            )}
            {p.portfolioUrls.length > 0 && (
              <div>
                <h2 className="mb-2 font-semibold">{t("profile.portfolio")}</h2>
                <ul className="space-y-1 text-sm">
                  {p.portfolioUrls.map((u) => (
                    <li key={u}><a href={u} target="_blank" rel="noopener noreferrer nofollow" className="text-amber-700 underline break-all">{u}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <div>
          <h2 className="mb-3 text-lg font-semibold">{t("pro.reviews")}</h2>
          {reviews.length === 0 ? (
            <Empty>{t("pro.noReviews")}</Empty>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <Card key={r.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{r.author.profile?.companyName || r.author.profile?.displayName}</span>
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{r.posting.title} · {formatDate(r.createdAt, locale)}</p>
                  {r.comment && <p className="mt-2 text-sm text-stone-700">{r.comment}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {facts.length > 0 && (
          <Card>
            <dl className="space-y-2 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-stone-500">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
              {p.website && (
                <div className="flex justify-between gap-3">
                  <dt className="text-stone-500">{t("profile.website")}</dt>
                  <dd><a href={p.website} target="_blank" rel="noopener noreferrer nofollow" className="text-amber-700 underline">{new URL(p.website).hostname}</a></dd>
                </div>
              )}
            </dl>
            {p.serviceCounties.length > 0 && (
              <div className="mt-4 border-t border-stone-100 pt-3">
                <p className="mb-1 text-xs text-stone-500">{t("profile.serviceCounties")}</p>
                <p className="text-sm">{p.serviceCounties.map(countyName).join(", ")}</p>
              </div>
            )}
          </Card>
        )}
        {invitable.length > 0 && (
          <Card>
            <h2 className="mb-3 font-semibold">{t("pro.invite")}</h2>
            <form action={invitePro} className="space-y-3">
              <input type="hidden" name="proId" value={user.id} />
              <select name="postingId" className={inputCls}>
                {invitable.map((post) => <option key={post.id} value={post.id}>{post.title}</option>)}
              </select>
              <button className={btnSecondaryCls}>{t("pro.sendInvite")}</button>
            </form>
          </Card>
        )}
        {!viewer && (
          <Card>
            <p className="text-sm text-stone-600">{t("pro.loginToContact")}</p>
            <Link href="/signup" className="mt-2 inline-block text-sm font-medium text-amber-700 underline">{t("nav.signup")}</Link>
          </Card>
        )}
      </div>
    </div>
  );
}
