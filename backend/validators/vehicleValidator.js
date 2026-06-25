import { z } from "zod"

export const vehicleSchema = z.object({
    brand_id: z.coerce.number().int().positive().nullable(),
    cost_id: z.coerce.number().int().positive().nullable(),
    model: z.string(),
    vehicle_type: z.string(),
    transmission: z.string(),
    color: z.string(),
    doors: z.coerce.number().int().min(2).max(10),
    production_year: z.iso.date(),
    fuel_type: z.string(),
    file_name: z.string().optional().nullable()
})

export const updateVehicleSchema = vehicleSchema.partial();
