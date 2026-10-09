import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { dateTag, getT } from "@/lib/i18n";
import { getConversation } from "@/server/queries";
import { markRead, sendMessage } from "@/server/message-actions";
import { withdrawApplication } from "@/server/posting-actions";
import { AutoRefresh } from "@/components/auto-refresh";
import { SubmitButton } from "@/components/forms";
import { Badge, Card, inputCls } from "@/components/ui";

export default async function ConversationPage({ params }: PageProps<"/messages/[id]">) {
  const { id } = await params;
  const user = await requireProfile();
  const { t, locale } = await getT();
  const convo = await getConversation(id, user.id);
  if (!convo) notFound();
  await markRead(convo.id, user.id);

  const iAmApplicant = convo.applicantId === user.id;
  const otherUser = iAmApplicant ? convo.posting.author : convo.applicant;
  const other = otherUser.profile;
  const time = (d: Date) =>
    d.toLocaleString(dateTag(locale), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <AutoRefresh />
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/pros/${otherUser.id}`} className="font-semibold hover:underline">{other?.companyName || other?.displayName}</Link>
          <p className="text-sm text-stone-600">
            <Link href={`/postings/${convo.postingId}`} className="underline">{convo.posting.title}</Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{t(`appStatus.${convo.status}`)}</Badge>
          {iAmApplicant && convo.status !== "ACCEPTED" && (
            <form action={withdrawApplication}>
              <input type="hidden" name="applicationId" value={convo.id} />
              <button className="text-xs text-red-700 underline">{t("messages.withdraw")}</button>
            </form>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        {convo.messages.length === 0 && <p className="text-center text-sm text-stone-500">{t("messages.start")}</p>}
        {convo.messages.map((m) => {
          const mine = m.senderId === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-amber-500 text-stone-950" : "border border-stone-200 bg-white"}`}>
                <p className="whitespace-pre-line break-words">{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-stone-800" : "text-stone-500"}`}>{time(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form action={sendMessage} className="sticky bottom-0 flex gap-2 border-t border-stone-200 bg-stone-50 py-3">
        <input type="hidden" name="applicationId" value={convo.id} />
        <textarea name="body" required rows={2} placeholder={t("messages.placeholder")} className={inputCls} />
        <SubmitButton>{t("messages.send")}</SubmitButton>
      </form>
    </div>
  );
}
