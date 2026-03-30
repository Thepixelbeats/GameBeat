import { z } from "zod";

export const emailSignInSchema = z.object({
  email: z.email("Enter a valid email address."),
});
