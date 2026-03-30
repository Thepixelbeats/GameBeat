import { TonightView } from "@/features/tonight/tonight-view";
import { analyticsEventNames } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";
import { getTonightPageData } from "@/services/tonight/get-tonight-page-data";

type TonightPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TonightPage({ searchParams }: TonightPageProps) {
  const data = await getTonightPageData(searchParams ? await searchParams : {});

  await trackServerEvent(analyticsEventNames.tonightSuggestionsViewed, {
    session_length: data.filters.sessionLength,
    mood: data.filters.mood,
    play_style: data.filters.playStyle,
    suggestions_count: data.suggestions.length,
    tracked_options_count: data.trackedOptionsCount,
  });

  return <TonightView data={data} />;
}
