import { z } from "zod";

export const rentSchema = z.object({

  vehicle_id: z.number().int().positive(),

  client_id: z.number().int().positive(),

  date_rented: z.iso.date(),

  date_returned: z.iso.date().nullable(),

  date_to_return: z.iso.date().nullable(),
  
  is_returned: z.boolean().nullable()
});

export const updateRentSchema = rentSchema.partial();