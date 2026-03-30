import { GameStatus } from "@/lib/db/prisma-client";
import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
};

export const addBacklogEntrySchema = z.object({
  gameId: z.string().cuid(),
});

export const updateBacklogEntrySchema = z.object({
  entryId: z.string().cuid(),
  status: z.nativeEnum(GameStatus),
  userRating: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(1).max(10).optional()
  ),
  notes: z.preprocess(
    emptyStringToUndefined,
    z.string().max(500).optional()
  ),
  priority: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(1).max(5).optional()
  ),
});

export const removeBacklogEntrySchema = z.object({
  entryId: z.string().cuid(),
});
