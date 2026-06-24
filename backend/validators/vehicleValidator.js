import { z } from "zod"

export const vehicleSchema = z.object({
    brand_id: z.number().int().positive().nullable(),
    cost_id: z.number().int().positive().nullable(),
    model: z.string(),
    vehicle_type: z.string(),
    transmision: z.string(),
    color: z.string(),
    doors: z.number().int().min(2).max(10),
    production_year: z.iso.date(),
    fuel_type: z.string(),
    file_name: z.string().nullable()
})

export const updateVehicleSchema = vehicleSchema.partial();