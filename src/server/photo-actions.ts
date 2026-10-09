"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireProfile } from "@/lib/auth";
import {
  MAX_PHOTO_BYTES,
  MAX_PHOTOS,
  PHOTO_TYPES,
  deleteObject,
  headObject,
  presignUpload,
  storageEnabled,
} from "@/lib/storage";
import { str } from "@/server/form";

type UploadTicket = { ok: true; url: string; key: string } | { ok: false };

export async function createPhotoUpload(contentType: string, size: number): Promise<UploadTicket> {
  const user = await requireProfile();
  const ext = PHOTO_TYPES[contentType];
  if (!storageEnabled() || !ext || size <= 0 || size > MAX_PHOTO_BYTES) return { ok: false };
  if (user.profile.photoKeys.length >= MAX_PHOTOS) return { ok: false };
  const key = `profiles/${user.id}/${randomBytes(12).toString("hex")}.${ext}`;
  return { ok: true, url: await presignUpload(key, contentType), key };
}

/** Called after the browser's upload finishes; checks the object before attaching it to the profile. */
export async function confirmPhotoUpload(key: string): Promise<boolean> {
  const user = await requireProfile();
  if (!key.startsWith(`profiles/${user.id}/`) || user.profile.photoKeys.includes(key)) return false;
  const head = await headObject(key);
  const valid = !!head && head.size <= MAX_PHOTO_BYTES && head.contentType in PHOTO_TYPES;
  if (!valid || user.profile.photoKeys.length >= MAX_PHOTOS) {
    if (head) await deleteObject(key);
    return false;
  }
  await db.profile.update({ where: { userId: user.id }, data: { photoKeys: { push: key } } });
  revalidatePath(`/pros/${user.id}`);
  return true;
}

export async function removePhoto(form: FormData) {
  const user = await requireProfile();
  const key = str(form, "key");
  if (!user.profile.photoKeys.includes(key)) return;
  await db.profile.update({
    where: { userId: user.id },
    data: { photoKeys: user.profile.photoKeys.filter((k) => k !== key) },
  });
  await deleteObject(key);
  revalidatePath("/profile/edit");
  revalidatePath(`/pros/${user.id}`);
}
