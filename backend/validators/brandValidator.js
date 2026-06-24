import { z } from "zod";

export const brandSchema = z.object({
  brand_id: z.number().int().positive(),

  brand: z.string(),

  origin: z.string()
});

export const updateBrandSchema = brandSchema.partial();