import { NextResponse } from "next/server";

import { getCurrentUserSession } from "@/lib/auth/session";
import { gameSearchQuerySchema } from "@/lib/validations/games";
import { searchPublicGames } from "@/services/games/search-public-games";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getCurrentUserSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Please sign in to search for games.",
      },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const parsed = gameSearchQuerySchema.safeParse({
    query: url.searchParams.get("query") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "Search input is invalid.",
      },
      { status: 400 }
    );
  }

  try {
    const results = await searchPublicGames(parsed.data.query);

    return NextResponse.json({
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while searching for games.",
      },
      { status: 502 }
    );
  }
}
