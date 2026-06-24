import { z } from "zod";

export const vehicleDamageSchema = z.object({
  client_id: z.number().int().positive(),

  vehicle_id: z.number().int().positive(),

  damage: z.string(),

  other_info: z.string().optional(),

  date_of_damage: z.iso.date()
});

export const updateVehicleDamageSchema = vehicleDamageSchema.partial();