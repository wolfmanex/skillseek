"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import { optInt, str } from "@/server/form";

/**
 * After a posting is completed, its owner can review each accepted pro,
 * and each accepted pro can review the owner. One review per pair per posting.
 */
export async function leaveReview(form: FormData) {
  const user = await requireProfile();
  const rating = optInt(form, "rating");
  if (!rating || rating < 1 || rating > 5) return;
  const posting = await db.posting.findUnique({
    where: { id: str(form, "postingId") },
    include: { applications: { where: { status: "ACCEPTED" } } },
  });
  if (!posting || posting.status !== "COMPLETED") return;

  const subjectId = str(form, "subjectId");
  const accepted = new Set(posting.applications.map((a) => a.applicantId));
  const allowed =
    (posting.authorId === user.id && accepted.has(subjectId)) ||
    (accepted.has(user.id) && subjectId === posting.authorId);
  if (!allowed) return;

  await db.review.upsert({
    where: { postingId_authorId_subjectId: { postingId: posting.id, authorId: user.id, subjectId } },
    create: { postingId: posting.id, authorId: user.id, subjectId, rating, comment: str(form, "comment") },
    update: { rating, comment: str(form, "comment") },
  });
  revalidatePath(`/postings/${posting.id}`);
  revalidatePath(`/pros/${subjectId}`);
}
