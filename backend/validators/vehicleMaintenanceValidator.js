import { z } from "zod";

export const vehicleMaintenanceSchema = z.object({


  service_type: z.string(),

  service_date: z.iso.date(),

  service_cost: z.number().positive(),

  other_info: z.string().optional()
});

export const updateVehicleMaintenanceSchema = vehicleMaintenanceSchema.partial();