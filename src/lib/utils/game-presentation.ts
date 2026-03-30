export function formatReleaseYear(value: string | null) {
  if (!value) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
  }).format(new Date(value));
}

export function formatStatusLabel(status: string) {
  return status.toLowerCase().replaceAll("_", " ");
}

export function formatGenreSummary(genres: string[]) {
  return genres.length > 0 ? genres.join(" • ") : "Genres unavailable";
}

export function formatPlatformSummary(platforms: string[]) {
  return platforms.length > 0
    ? platforms.join(" • ")
    : "Platform details unavailable";
}
