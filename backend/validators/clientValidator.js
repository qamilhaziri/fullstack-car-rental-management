import { z } from "zod";

export const clientSchema = z.object({
    client_name: z.string(),

    client_surname: z.string(),

    personal_number: z.string(),

    gender: z.enum([
        "Male",
        "Female"
    ]),

    city: z.string(),

    email: z.email(),

    date_of_birth: z.iso.date(),

    phone_number: z.string(),

    nationality: z.string()
});

export const updateClientSchema = clientSchema.partial();