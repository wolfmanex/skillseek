import Link from "next/link";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import { formatDate, getT } from "@/lib/i18n";
import { Card, Empty, PageHeader } from "@/components/ui";

export default async function MessagesPage() {
  const user = await requireProfile();
  const { t, locale } = await getT();
  const threads = await db.application.findMany({
    where: { OR: [{ applicantId: user.id }, { posting: { authorId: user.id } }] },
    include: {
      posting: { include: { author: { include: { profile: true } } } },
      applicant: { include: { profile: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { readAt: null, senderId: { not: user.id } } } } },
    },
  });
  threads.sort(
    (a, b) => (b.messages[0]?.createdAt ?? b.updatedAt).getTime() - (a.messages[0]?.createdAt ?? a.updatedAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("nav.messages")} />
      {threads.length === 0 ? (
        <Empty>{t("messages.empty")}</Empty>
      ) : (
        <Card className="divide-y divide-stone-100 p-0">
          {threads.map((th) => {
            const other = th.applicantId === user.id ? th.posting.author.profile : th.applicant.profile;
            const last = th.messages[0];
            const unread = th._count.messages;
            return (
              <Link key={th.id} href={`/messages/${th.id}`} className="flex items-start justify-between gap-3 px-5 py-4 hover:bg-stone-50">
                <div className="min-w-0">
                  <p className={`truncate text-sm ${unread ? "font-bold" : "font-medium"}`}>{other?.companyName || other?.displayName}</p>
                  <p className="truncate text-xs text-stone-500">{th.posting.title}</p>
                  {last && <p className="mt-1 truncate text-sm text-stone-600">{last.body}</p>}
                </div>
                <div className="shrink-0 text-right text-xs text-stone-500">
                  {last && formatDate(last.createdAt, locale)}
                  {unread > 0 && <div className="mt-1 inline-block rounded-full bg-amber-500 px-1.5 font-bold text-stone-950">{unread}</div>}
                </div>
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}
