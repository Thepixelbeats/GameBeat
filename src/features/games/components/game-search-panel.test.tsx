// @vitest-environment jsdom

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { addSearchGameToBacklogActionMock, fetchMock } = vi.hoisted(() => ({
  addSearchGameToBacklogActionMock: vi.fn(),
  fetchMock: vi.fn(),
}));

vi.mock("@/app/(app)/discover/actions", () => ({
  addSearchGameToBacklogAction: addSearchGameToBacklogActionMock,
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

import { GameSearchPanel } from "@/features/games/components/game-search-panel";

describe("GameSearchPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    addSearchGameToBacklogActionMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("renders debounced search results", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            externalId: "steam:70",
            title: "Half-Life",
            coverUrl: "https://cdn.example.com/half-life.jpg",
            releaseDate: "2024-01-01T00:00:00.000Z",
            genres: ["Shooter", "Action"],
          },
        ],
      }),
    } as Response);

    render(<GameSearchPanel />);

    fireEvent.change(screen.getByLabelText("Search games"), {
      target: { value: "Half-Life" },
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
      await Promise.resolve();
    });

    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getByText("Half-Life")).toBeInTheDocument();
    });

    expect(screen.getByText("Shooter")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("shows a user-friendly error state when search fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Steam search is unavailable right now.",
      }),
    } as Response);

    render(<GameSearchPanel />);

    fireEvent.change(screen.getByLabelText("Search games"), {
      target: { value: "Portal" },
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
      await Promise.resolve();
    });

    vi.useRealTimers();

    await waitFor(() => {
      expect(
        screen.getByText("We couldn't load search results")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Steam search is unavailable right now.")
    ).toBeInTheDocument();
  });
});
