import { z } from "zod";

export const gameSearchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, "Type at least 2 characters to search.")
    .max(80, "Searches must be 80 characters or fewer."),
});

export const addSearchGameToBacklogSchema = z.object({
  externalId: z.string().trim().min(1).max(64),
  title: z.string().trim().min(1).max(160),
  coverUrl: z.string().trim().url().max(500).optional(),
  releaseDate: z.string().datetime({ offset: true }).optional(),
  genres: z.array(z.string().trim().min(1).max(40)).max(4),
});

export type AddSearchGameToBacklogInput = z.infer<
  typeof addSearchGameToBacklogSchema
>;
