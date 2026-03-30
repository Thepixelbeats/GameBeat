import type { PublicGameSearchResult } from "@/services/games/types";

const STEAM_SEARCH_URL = "https://store.steampowered.com/api/storesearch/";
const STEAM_DETAILS_URL = "https://store.steampowered.com/api/appdetails";
const MAX_RESULTS = 12;

type SteamSearchResponse = {
  items?: Array<{
    type?: string;
    id?: number;
    tiny_image?: string;
  }>;
};

type SteamAppDetailsResponse = Record<
  string,
  {
    success?: boolean;
    data?: {
      type?: string;
      name?: string;
      header_image?: string;
      genres?: Array<{
        description?: string;
      }>;
      release_date?: {
        coming_soon?: boolean;
        date?: string;
      };
    };
  }
>;

export async function searchPublicGames(
  query: string
): Promise<PublicGameSearchResult[]> {
  const searchParams = new URLSearchParams({
    term: query,
    l: "english",
    cc: "us",
  });

  const searchPayload = await fetchSteamJson<SteamSearchResponse>(
    `${STEAM_SEARCH_URL}?${searchParams.toString()}`,
    "Steam search is unavailable right now."
  );

  const items = (searchPayload.items ?? [])
    .filter((item): item is { id: number; tiny_image?: string; type?: string } => {
      return item.type === "app" && typeof item.id === "number";
    })
    .filter((item, index, values) => {
      return values.findIndex((candidate) => candidate.id === item.id) === index;
    })
    .slice(0, MAX_RESULTS);

  if (items.length === 0) {
    return [];
  }

  const games = await Promise.allSettled(
    items.map((item) => fetchPublicGameDetails(item.id, item.tiny_image))
  );

  const seenExternalIds = new Set<string>();

  return games
    .flatMap((result) => {
      if (result.status !== "fulfilled" || result.value === null) {
        return [];
      }

      if (seenExternalIds.has(result.value.externalId)) {
        return [];
      }

      seenExternalIds.add(result.value.externalId);
      return [result.value];
    });
}

async function fetchPublicGameDetails(
  appId: number,
  fallbackCoverUrl?: string
): Promise<PublicGameSearchResult | null> {
  const detailsParams = new URLSearchParams({
    appids: String(appId),
    l: "english",
    cc: "us",
  });

  const detailsPayload = await fetchSteamJson<SteamAppDetailsResponse>(
    `${STEAM_DETAILS_URL}?${detailsParams.toString()}`,
    "Steam game details are unavailable right now."
  );

  const game = detailsPayload[String(appId)];
  const gameData = game?.data;
  const title = gameData?.name?.trim();

  if (!game?.success || !gameData || !title || gameData.type !== "game") {
    return null;
  }

  return {
    externalId: `steam:${appId}`,
    title,
    coverUrl: gameData.header_image ?? fallbackCoverUrl ?? null,
    releaseDate: parseReleaseDate(gameData.release_date),
    genres: (gameData.genres ?? [])
      .map((genre) => genre.description?.trim())
      .filter((genre): genre is string => Boolean(genre))
      .slice(0, 4),
  };
}

async function fetchSteamJson<T>(
  url: string,
  fallbackMessage: string
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Steam returned malformed data.");
  }
}

function parseReleaseDate(
  releaseDate?: {
    coming_soon?: boolean;
    date?: string;
  } | null
) {
  if (!releaseDate?.date || releaseDate.coming_soon) {
    return null;
  }

  const timestamp = Date.parse(releaseDate.date);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}
