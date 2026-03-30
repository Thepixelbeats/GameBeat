import {
  listUserBacklogEntries,
  listUserBacklogCountsByStatus,
} from "@/lib/db/backlog";
import { listGameRecords, serializeGameRecord } from "@/lib/db/games";
import { getCurrentUser } from "@/services/auth/get-current-user";
import type { BacklogEntry, BacklogPageData } from "@/services/backlog/types";

function serializeBacklogEntry(
  entry: Awaited<ReturnType<typeof listUserBacklogEntries>>[number]
): BacklogEntry {
  return {
    id: entry.id,
    status: entry.status,
    userRating: entry.userRating,
    notes: entry.notes,
    priority: entry.priority,
    addedAt: entry.addedAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    game: serializeGameRecord(entry.game),
  };
}

export async function getBacklogPageData(): Promise<BacklogPageData> {
  const user = await getCurrentUser();

  const [entries, availableGames, statusCounts] = await Promise.all([
    listUserBacklogEntries(user.id),
    listGameRecords(),
    listUserBacklogCountsByStatus(user.id),
  ]);

  return {
    entries: entries.map(serializeBacklogEntry),
    availableGames: availableGames.map(serializeGameRecord),
    statusCounts,
  };
}
