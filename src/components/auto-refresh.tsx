"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Lightweight "live" chat for the MVP: re-fetch the server-rendered thread on an interval.
export function AutoRefresh({ seconds = 5 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
