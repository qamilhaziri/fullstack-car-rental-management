import { z } from "zod";

export const paymentSchema = z.object({
  rent_id: z.number().int().positive(),

  payment_amount: z.number().positive(),

  date_payment: z.iso.date()
});

export const updatePaymentSchema = paymentSchema.partial();