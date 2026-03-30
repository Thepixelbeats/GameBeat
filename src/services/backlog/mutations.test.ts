import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  countUserEntriesForGameMock,
  createUserBacklogEntryMock,
  deleteUserBacklogEntryMock,
  updateUserBacklogEntryMock,
  findGameRecordByIdMock,
  getCurrentUserMock,
} = vi.hoisted(() => ({
  countUserEntriesForGameMock: vi.fn(),
  createUserBacklogEntryMock: vi.fn(),
  deleteUserBacklogEntryMock: vi.fn(),
  updateUserBacklogEntryMock: vi.fn(),
  findGameRecordByIdMock: vi.fn(),
  getCurrentUserMock: vi.fn(),
}));

vi.mock("@/lib/db/backlog", () => ({
  countUserEntriesForGame: countUserEntriesForGameMock,
  createUserBacklogEntry: createUserBacklogEntryMock,
  deleteUserBacklogEntry: deleteUserBacklogEntryMock,
  updateUserBacklogEntry: updateUserBacklogEntryMock,
}));

vi.mock("@/lib/db/games", () => ({
  findGameRecordById: findGameRecordByIdMock,
}));

vi.mock("@/services/auth/get-current-user", () => ({
  getCurrentUser: getCurrentUserMock,
}));

import {
  addBacklogEntry,
  removeBacklogEntry,
  updateBacklogEntry,
} from "@/services/backlog/mutations";
import { makeGame, makeUser } from "@/test/factories";

describe("backlog mutations", () => {
  beforeEach(() => {
    countUserEntriesForGameMock.mockReset();
    createUserBacklogEntryMock.mockReset();
    deleteUserBacklogEntryMock.mockReset();
    updateUserBacklogEntryMock.mockReset();
    findGameRecordByIdMock.mockReset();
    getCurrentUserMock.mockReset();

    getCurrentUserMock.mockResolvedValue(
      makeUser({ id: "c00000000000000000000001" })
    );
  });

  it("adds a game to the backlog when the record is valid", async () => {
    const game = makeGame({ id: "c00000000000000000000002" });
    const formData = new FormData();
    formData.set("gameId", game.id);

    findGameRecordByIdMock.mockResolvedValue(game);
    countUserEntriesForGameMock.mockResolvedValue(0);
    createUserBacklogEntryMock.mockResolvedValue({
      id: "c00000000000000000000003",
    });

    const result = await addBacklogEntry(formData);

    expect(result).toEqual({ ok: true });
    expect(createUserBacklogEntryMock).toHaveBeenCalledWith({
      userId: "c00000000000000000000001",
      gameId: game.id,
    });
  });

  it("rejects backlog adds when the game is already tracked", async () => {
    const game = makeGame({ id: "c00000000000000000000004" });
    const formData = new FormData();
    formData.set("gameId", game.id);

    findGameRecordByIdMock.mockResolvedValue(game);
    countUserEntriesForGameMock.mockResolvedValue(1);

    const result = await addBacklogEntry(formData);

    expect(result).toEqual({
      ok: false,
      message: "That game is already in your backlog.",
    });
    expect(createUserBacklogEntryMock).not.toHaveBeenCalled();
  });

  it("updates a backlog entry status and clears empty optional fields", async () => {
    const formData = new FormData();
    formData.set("entryId", "c00000000000000000000005");
    formData.set("status", "COMPLETED");
    formData.set("userRating", "");
    formData.set("notes", "");
    formData.set("priority", "");

    updateUserBacklogEntryMock.mockResolvedValue({
      previousStatus: "BACKLOG",
      entry: {
        id: "c00000000000000000000005",
        status: "COMPLETED",
      },
    });

    const result = await updateBacklogEntry(formData);

    expect(result).toEqual({ ok: true });
    expect(updateUserBacklogEntryMock).toHaveBeenCalledWith(
      "c00000000000000000000005",
      "c00000000000000000000001",
      {
        status: "COMPLETED",
        userRating: null,
        notes: null,
        priority: null,
      }
    );
  });

  it("returns a friendly message when removing an already-missing entry", async () => {
    const formData = new FormData();
    formData.set("entryId", "c00000000000000000000006");

    deleteUserBacklogEntryMock.mockRejectedValue(
      new Error("Backlog entry not found.")
    );

    const result = await removeBacklogEntry(formData);

    expect(result).toEqual({
      ok: false,
      message: "That backlog entry was already removed.",
    });
  });
});
