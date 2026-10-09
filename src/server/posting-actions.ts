"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus, PostingStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import { isCountry } from "@/lib/constants";
import { canPost, canRespondTo } from "@/lib/matching";
import { STATUS_FLOW } from "@/lib/postings";
import { appUrl, sendEmail } from "@/lib/email";
import { getT } from "@/lib/i18n";
import { lines, list, optDate, optInt, optStr, str, type FormState } from "@/server/form";

const SEEKING = ["SUBCONTRACTOR", "SPECIALIST", "ANY"] as const;

export async function createPosting(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireProfile();
  const { t } = await getT();
  if (!canPost(user.role)) return { error: t("posting.error.cannotPost") };

  const title = str(form, "title");
  const description = str(form, "description");
  const country = str(form, "country");
  const tradeSlugs = list(form, "trades");
  const seeking = str(form, "seeking") as (typeof SEEKING)[number];

  if (!title || !description) return { error: t("posting.error.required") };
  if (!isCountry(country)) return { error: t("posting.error.country") };
  if (tradeSlugs.length === 0) return { error: t("posting.error.trades") };
  if (!SEEKING.includes(seeking)) return { error: t("posting.error.required") };

  const budgetMin = optInt(form, "budgetMin");
  const budgetMax = optInt(form, "budgetMax");
  if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
    return { error: t("posting.error.budget") };
  }
  const startDate = optDate(form, "startDate");
  const endDate = optDate(form, "endDate");
  if (startDate && endDate && startDate > endDate) return { error: t("posting.error.dates") };

  const posting = await db.posting.create({
    data: {
      authorId: user.id,
      title,
      description,
      country,
      city: optStr(form, "city"),
      startDate,
      endDate,
      budgetMin,
      budgetMax,
      seeking,
      requiredCerts: lines(form, "requiredCerts"),
      trades: { connect: tradeSlugs.map((slug) => ({ slug })) },
    },
  });
  redirect(`/postings/${posting.id}`);
}


export async function setPostingStatus(form: FormData) {
  const user = await requireProfile();
  const posting = await db.posting.findUnique({ where: { id: str(form, "postingId") } });
  const next = str(form, "status") as PostingStatus;
  if (!posting || posting.authorId !== user.id) return;
  if (!STATUS_FLOW[posting.status].includes(next)) return;
  await db.posting.update({ where: { id: posting.id }, data: { status: next } });
  revalidatePath(`/postings/${posting.id}`);
}

export async function applyToPosting(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireProfile();
  const { t } = await getT();
  const posting = await db.posting.findUnique({
    where: { id: str(form, "postingId") },
    include: { author: true },
  });
  if (!posting || posting.status !== "OPEN") return { error: t("apply.error.closed") };
  if (posting.authorId === user.id || !canRespondTo(user.role, posting.seeking)) {
    return { error: t("apply.error.notEligible") };
  }

  const message = str(form, "message");
  const existing = await db.application.findUnique({
    where: { postingId_applicantId: { postingId: posting.id, applicantId: user.id } },
  });
  // Applying to a posting you were invited to just adds your note to the existing thread.
  const application =
    existing ??
    (await db.application.create({ data: { postingId: posting.id, applicantId: user.id, message } }));
  if (message) {
    await db.message.create({ data: { applicationId: application.id, senderId: user.id, body: message } });
  }

  await sendEmail({
    to: posting.author.email,
    subject: `Skillseek: ${user.profile.displayName} applied to "${posting.title}"`,
    text: `${user.profile.displayName} applied to your posting "${posting.title}".\n\n${message}\n\n${appUrl(`/postings/${posting.id}`)}`,
  });
  redirect(`/messages/${application.id}`);
}

export async function invitePro(form: FormData) {
  const user = await requireProfile();
  const posting = await db.posting.findUnique({ where: { id: str(form, "postingId") } });
  const pro = await db.user.findUnique({ where: { id: str(form, "proId") }, include: { profile: true } });
  if (!posting || posting.authorId !== user.id || posting.status !== "OPEN") return;
  if (!pro?.profile || !canRespondTo(pro.role, posting.seeking)) return;

  const application = await db.application.upsert({
    where: { postingId_applicantId: { postingId: posting.id, applicantId: pro.id } },
    create: { postingId: posting.id, applicantId: pro.id, source: "INVITED" },
    update: {},
  });
  await db.message.create({
    data: {
      applicationId: application.id,
      senderId: user.id,
      body: `${user.profile.displayName} invited you to "${posting.title}".`,
    },
  });
  await sendEmail({
    to: pro.email,
    subject: `Skillseek: you're invited to "${posting.title}"`,
    text: `${user.profile.displayName} invited you to their posting "${posting.title}".\n\n${appUrl(`/messages/${application.id}`)}`,
  });
  revalidatePath(`/postings/${posting.id}`);
  revalidatePath(`/pros/${pro.id}`);
}

const APPLICATION_STATUSES: ApplicationStatus[] = ["PENDING", "SHORTLISTED", "ACCEPTED", "DECLINED"];

export async function setApplicationStatus(form: FormData) {
  const user = await requireProfile();
  const status = str(form, "status") as ApplicationStatus;
  if (!APPLICATION_STATUSES.includes(status)) return;
  const application = await db.application.findUnique({
    where: { id: str(form, "applicationId") },
    include: { posting: true, applicant: true },
  });
  if (!application || application.posting.authorId !== user.id) return;

  await db.application.update({ where: { id: application.id }, data: { status } });
  if (status === "SHORTLISTED" || status === "ACCEPTED") {
    await sendEmail({
      to: application.applicant.email,
      subject: `Skillseek: you were ${status.toLowerCase()} for "${application.posting.title}"`,
      text: `${user.profile.displayName} ${status.toLowerCase()} you for "${application.posting.title}".\n\n${appUrl(`/messages/${application.id}`)}`,
    });
  }
  revalidatePath(`/postings/${application.postingId}`);
  revalidatePath(`/messages/${application.id}`);
}

export async function withdrawApplication(form: FormData) {
  const user = await requireProfile();
  const application = await db.application.findUnique({ where: { id: str(form, "applicationId") } });
  if (!application || application.applicantId !== user.id || application.status === "ACCEPTED") return;
  await db.application.delete({ where: { id: application.id } });
  redirect("/dashboard");
}
