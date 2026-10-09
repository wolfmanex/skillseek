"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import { appUrl, sendEmail } from "@/lib/email";
import { getConversation } from "@/server/queries";
import { str } from "@/server/form";

export async function sendMessage(form: FormData) {
  const user = await requireProfile();
  const body = str(form, "body");
  const convo = await getConversation(str(form, "applicationId"), user.id);
  if (!convo || !body) return;

  const recipient = convo.applicantId === user.id ? convo.posting.author : convo.applicant;
  // Email only on the first unread message, so a burst of chat sends one notification.
  const alreadyUnread = convo.messages.some((m) => m.senderId === user.id && !m.readAt);

  await db.message.create({ data: { applicationId: convo.id, senderId: user.id, body: body.slice(0, 5000) } });

  if (!alreadyUnread) {
    await sendEmail({
      to: recipient.email,
      subject: `Skillseek: new message about "${convo.posting.title}"`,
      text: `${user.profile.displayName} wrote:\n\n${body}\n\n${appUrl(`/messages/${convo.id}`)}`,
    });
  }
  revalidatePath(`/messages/${convo.id}`);
}

export async function markRead(applicationId: string, userId: string) {
  await db.message.updateMany({
    where: { applicationId, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });
}
