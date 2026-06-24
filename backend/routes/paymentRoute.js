import {  registerPayment,getPaymentByRentId,getPaymentById,updatePayment,removePayment } from "../controllers/paymentController.js";
import express from "express"
import { validate } from "../middleware/validate.js";
import { paymentSchema, updatePaymentSchema } from "../validators/paymentValidator.js";

const paymentRouter = express.Router();

paymentRouter.post("/",validate(paymentSchema),registerPayment);

paymentRouter.get("/rent/:id",getPaymentByRentId);

paymentRouter.get("/:id",getPaymentById);

paymentRouter.patch("/:id",validate(updatePaymentSchema),updatePayment)

paymentRouter.delete("/:id",removePayment)

export default paymentRouter;