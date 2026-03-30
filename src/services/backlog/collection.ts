import type {
  BacklogEntry,
  BacklogFilterStatus,
  BacklogGameRecord,
  BacklogSortOption,
} from "@/services/backlog/types";
import { formatStatusLabel } from "@/lib/utils/game-presentation";

export function sortBacklogEntries(
  entries: BacklogEntry[],
  sortBy: BacklogSortOption
) {
  return [...entries].sort((left, right) => {
    switch (sortBy) {
      case "title":
        return left.game.title.localeCompare(right.game.title);
      case "priority":
        return (left.priority ?? 99) - (right.priority ?? 99);
      case "rating":
        return (right.userRating ?? -1) - (left.userRating ?? -1);
      case "status":
        return formatStatusLabel(left.status).localeCompare(
          formatStatusLabel(right.status)
        );
      case "recent":
      default:
        return (
          new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime()
        );
    }
  });
}

export function filterBacklogEntries(
  entries: BacklogEntry[],
  query: string,
  status: BacklogFilterStatus
) {
  const normalizedQuery = query.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      entry.game.title.toLowerCase().includes(normalizedQuery) ||
      entry.game.genres.some((genre) =>
        genre.toLowerCase().includes(normalizedQuery)
      ) ||
      entry.game.platforms.some((platform) =>
        platform.toLowerCase().includes(normalizedQuery)
      );

    const matchesStatus = status === "ALL" || entry.status === status;

    return matchesQuery && matchesStatus;
  });
}

export function filterAvailableBacklogGames(
  games: BacklogGameRecord[],
  entries: BacklogEntry[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();
  const usedGameIds = new Set(entries.map((entry) => entry.game.id));

  return games.filter((game) => {
    if (usedGameIds.has(game.id)) {
      return false;
    }

    if (normalizedQuery.length === 0) {
      return true;
    }

    return (
      game.title.toLowerCase().includes(normalizedQuery) ||
      game.genres.some((genre) => genre.toLowerCase().includes(normalizedQuery)) ||
      game.platforms.some((platform) =>
        platform.toLowerCase().includes(normalizedQuery)
      )
    );
  });
}
