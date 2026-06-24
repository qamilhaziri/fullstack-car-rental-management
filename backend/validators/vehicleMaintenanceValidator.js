import { z } from "zod";

export const vehicleMaintenanceSchema = z.object({
  vehicle_id: z.number().int().positive(),

  service_type: z.string(),

  service_date: z.string(),

  service_cost: z.number().positive(),

  other_info: z.string().optional()
});

export const updateVehicleMaintenanceSchema = vehicleMaintenanceSchema.partial();