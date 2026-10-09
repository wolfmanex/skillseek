import type { PostingStatus } from "@prisma/client";

// Which status changes a posting owner can make from each status.
export const STATUS_FLOW: Record<PostingStatus, PostingStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["COMPLETED", "OPEN"],
  COMPLETED: [],
  CLOSED: ["OPEN"],
};
