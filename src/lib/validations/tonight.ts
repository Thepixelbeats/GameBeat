import { z } from "zod";

export const tonightSessionLengthValues = ["short", "medium", "long"] as const;
export const tonightMoodValues = [
  "chill",
  "focused",
  "intense",
  "story",
] as const;
export const tonightPlayStyleValues = ["solo", "multiplayer"] as const;

export const tonightFiltersSchema = z.object({
  sessionLength: z
    .enum(tonightSessionLengthValues)
    .catch("medium")
    .default("medium"),
  mood: z.enum(tonightMoodValues).catch("focused").default("focused"),
  playStyle: z.enum(tonightPlayStyleValues).catch("solo").default("solo"),
});

export type TonightFiltersInput = z.infer<typeof tonightFiltersSchema>;
