import { z } from "zod";

const emptyStringToNull = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

export const updateSettingsProfileSchema = z.object({
  displayName: z.preprocess(
    emptyStringToNull,
    z.string().trim().min(2).max(40).nullable()
  ),
});
