import { z } from "zod";
import { normalizePhone } from "./phone";

export const waitlistSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(60, "First name must be 60 characters or fewer"),
  phone: z.string().transform((val, ctx) => {
    const res = normalizePhone(val);
    if (!res.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.error || "Enter a valid 10-digit Indian mobile number",
      });
      return z.NEVER;
    }
    return res.e164;
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to continue" }),
  }),
  answers: z
    .object({
      packaging: z.enum(["info", "designer"]),
      format: z.enum(["sachets", "jars", "either"]),
      build: z.enum(["premade", "custom", "unsure"]),
      customItems: z.array(z.string()).max(8).default([]),
      priceMin: z.number().int().min(500).max(4000),
      priceMax: z.number().int().min(500).max(4000),
    })
    .refine((a) => a.priceMin <= a.priceMax, {
      message: "Minimum price cannot exceed maximum price",
    }),
  utm: z.record(z.string().max(200)).optional(),
  turnstileToken: z.string().optional().default(""),
  hp: z.string().max(0, "Bot detected").optional().default(""),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;
export type WaitlistData = z.infer<typeof waitlistSchema>;
