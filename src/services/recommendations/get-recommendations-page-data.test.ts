import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  listRecommendationSignalEntriesMock,
  listRecommendationCandidateGamesMock,
  getCurrentUserMock,
} = vi.hoisted(() => ({
  listRecommendationSignalEntriesMock: vi.fn(),
  listRecommendationCandidateGamesMock: vi.fn(),
  getCurrentUserMock: vi.fn(),
}));

vi.mock("@/lib/db/recommendations", () => ({
  listRecommendationSignalEntries: listRecommendationSignalEntriesMock,
  listRecommendationCandidateGames: listRecommendationCandidateGamesMock,
}));

vi.mock("@/services/auth/get-current-user", () => ({
  getCurrentUser: getCurrentUserMock,
}));

import { getRecommendationsPageData } from "@/services/recommendations/get-recommendations-page-data";
import { makeEntry, makeGame, makeUser } from "@/test/factories";

describe("getRecommendationsPageData", () => {
  beforeEach(() => {
    listRecommendationSignalEntriesMock.mockReset();
    listRecommendationCandidateGamesMock.mockReset();
    getCurrentUserMock.mockReset();

    getCurrentUserMock.mockResolvedValue(makeUser({ name: "Samus" }));
  });

  it("ranks games by taste signals before critic-only fallbacks", async () => {
    listRecommendationSignalEntriesMock.mockResolvedValue([
      makeEntry({
        status: "COMPLETED",
        game: makeGame({
          title: "Hades",
          genres: ["Roguelike", "Action"],
        }),
      }),
      makeEntry({
        status: "PLAYING",
        userRating: 9,
        game: makeGame({
          title: "Slay the Spire",
          genres: ["Card Game", "Strategy"],
        }),
      }),
    ]);

    listRecommendationCandidateGamesMock.mockResolvedValue([
      makeGame({
        id: "c00000000000000000000030",
        title: "Dead Cells",
        genres: ["Roguelike", "Action"],
        rating: 8.2,
      }),
      makeGame({
        id: "c00000000000000000000031",
        title: "Mystery Game",
        genres: ["Puzzle"],
        rating: 9.5,
      }),
    ]);

    const data = await getRecommendationsPageData();

    expect(data.playerName).toBe("Samus");
    expect(data.favoriteGenres).toEqual([
      "Card Game",
      "Strategy",
      "Action",
      "Roguelike",
    ]);
    expect(data.recommendations[0]?.title).toBe("Dead Cells");
    expect(data.recommendations[0]?.matchedGenres).toEqual([
      "Action",
      "Roguelike",
    ]);
    expect(data.recommendations[0]?.explanation).toContain(
      "Lines up with your"
    );
    expect(data.recommendations[1]?.title).toBe("Mystery Game");
    expect(data.recommendations[1]?.explanation).toContain(
      "Strong fallback pick on critic score alone"
    );
  });

  it("returns an empty recommendation state when there are no candidates", async () => {
    listRecommendationSignalEntriesMock.mockResolvedValue([]);
    listRecommendationCandidateGamesMock.mockResolvedValue([]);

    const data = await getRecommendationsPageData();

    expect(data.favoriteGenres).toEqual([]);
    expect(data.recommendations).toEqual([]);
    expect(data.completedGamesCount).toBe(0);
    expect(data.highlyRatedGamesCount).toBe(0);
  });
});
