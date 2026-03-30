import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  listUserBacklogEntriesMock,
  listRecommendationCandidateGamesMock,
  getCurrentUserMock,
} = vi.hoisted(() => ({
  listUserBacklogEntriesMock: vi.fn(),
  listRecommendationCandidateGamesMock: vi.fn(),
  getCurrentUserMock: vi.fn(),
}));

vi.mock("@/lib/db/backlog", () => ({
  listUserBacklogEntries: listUserBacklogEntriesMock,
}));

vi.mock("@/lib/db/recommendations", () => ({
  listRecommendationCandidateGames: listRecommendationCandidateGamesMock,
}));

vi.mock("@/services/auth/get-current-user", () => ({
  getCurrentUser: getCurrentUserMock,
}));

import { getTonightPageData } from "@/services/tonight/get-tonight-page-data";
import { makeEntry, makeGame, makeUser } from "@/test/factories";

describe("getTonightPageData", () => {
  beforeEach(() => {
    listUserBacklogEntriesMock.mockReset();
    listRecommendationCandidateGamesMock.mockReset();
    getCurrentUserMock.mockReset();

    getCurrentUserMock.mockResolvedValue(makeUser({ name: "Aloy" }));
  });

  it("prefers tracked backlog options when enough tracked games exist", async () => {
    listUserBacklogEntriesMock.mockResolvedValue([
      makeEntry({
        status: "PLAYING",
        game: makeGame({
          title: "Current Run",
          genres: ["Action"],
        }),
      }),
      makeEntry({
        status: "BACKLOG",
        priority: 1,
        userRating: 9,
        notes: "short focus session",
        game: makeGame({
          title: "Priority Quest",
          genres: ["Strategy"],
        }),
      }),
      makeEntry({
        status: "WISHLIST",
        game: makeGame({
          title: "Wishlist Wildcard",
          genres: ["RPG"],
        }),
      }),
    ]);

    listRecommendationCandidateGamesMock.mockResolvedValue([
      makeGame({
        title: "Discovery Backup",
        genres: ["Shooter"],
      }),
    ]);

    const data = await getTonightPageData({
      sessionLength: "short",
      mood: "focused",
      playStyle: "solo",
    });

    expect(data.playerName).toBe("Aloy");
    expect(data.trackedOptionsCount).toBe(3);
    expect(data.suggestions).toHaveLength(3);
    expect(data.suggestions.every((suggestion) => suggestion.sourceLabel !== "Discovery")).toBe(true);
  });

  it("falls back to discovery suggestions when the tracked queue is thin", async () => {
    listUserBacklogEntriesMock.mockResolvedValue([
      makeEntry({
        status: "BACKLOG",
        game: makeGame({
          title: "One Backlog Game",
          genres: ["Action"],
        }),
      }),
    ]);

    listRecommendationCandidateGamesMock.mockResolvedValue([
      makeGame({
        id: "c00000000000000000000040",
        title: "Helldivers 2",
        genres: ["Shooter", "Action"],
      }),
      makeGame({
        id: "c00000000000000000000041",
        title: "Warframe",
        genres: ["Shooter", "Action"],
      }),
      makeGame({
        id: "c00000000000000000000042",
        title: "Diablo IV",
        genres: ["Action", "RPG"],
      }),
    ]);

    const data = await getTonightPageData({
      sessionLength: "medium",
      mood: "intense",
      playStyle: "multiplayer",
    });

    expect(data.suggestions).toHaveLength(3);
    expect(data.suggestions.some((suggestion) => suggestion.sourceLabel === "Discovery")).toBe(true);
    expect(data.multiplayerNote).toBeNull();
  });
});
