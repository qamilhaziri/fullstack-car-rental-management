import { z } from "zod";

export const vehicleCostSchema = z.object({

  cost_per_hour: z.number().positive(),

  cost_per_day:  z.number().positive()
});

export const updateVehicleCostSchema = vehicleCostSchema.partial();