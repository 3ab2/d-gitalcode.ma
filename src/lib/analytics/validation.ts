import { z } from "zod";

const MAX_METADATA_BYTES = 2_000;

const scalar = z.union([
  z.string().max(500),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

/** Public, unauthenticated endpoint: bound every field before it reaches the database. */
export const analyticsEventSchema = z.object({
  event: z.string().regex(/^[a-z][a-z0-9_]{1,63}$/),
  page: z.string().max(500).optional(),
  metadata: z
    .record(z.string().max(64), scalar)
    .refine((m) => JSON.stringify(m).length <= MAX_METADATA_BYTES, "too large")
    .optional(),
});
