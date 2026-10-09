"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmPhotoUpload, createPhotoUpload } from "@/server/photo-actions";
import { btnSecondaryCls } from "@/components/ui";

export function PhotoUploader({ labels }: { labels: { add: string; uploading: string; error: string } }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function upload(files: FileList) {
    setBusy(true);
    setFailed(false);
    for (const file of Array.from(files)) {
      const ticket = await createPhotoUpload(file.type, file.size);
      const put = ticket.ok
        ? await fetch(ticket.url, { method: "PUT", body: file, headers: { "Content-Type": file.type } }).catch(() => null)
        : null;
      if (!ticket.ok || !put?.ok || !(await confirmPhotoUpload(ticket.key))) setFailed(true);
    }
    setBusy(false);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => e.target.files?.length && upload(e.target.files)}
      />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className={btnSecondaryCls}>
        {busy ? labels.uploading : labels.add}
      </button>
      {failed && <p className="text-sm text-red-700">{labels.error}</p>}
    </div>
  );
}
