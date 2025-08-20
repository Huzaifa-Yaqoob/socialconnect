import { z } from "zod";

export const registrationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  password: z
    .string()
    .min(8, { message: "Password is required" })
    .max(64, { message: "Password must be at most 50 characters long" }),

  interests: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1, { message: "At least one interest is required" }),
});

export const loginSchema = registrationSchema.omit({ interests: true, name: true });

export type RegistrationInput = z.infer<typeof registrationSchema>;
