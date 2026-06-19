import {  registerPayment,getPaymentByRentId,getPaymentById,updatePayment,removePayment } from "../controllers/rentController.js";
import express from "express"

const paymentRouter = express.Router();

paymentRouter.post("/",registerPayment);

paymentRouter.get("/rent/:id",getPaymentByRentId);

paymentRouter.get("/:id",getPaymentById);

paymentRouter.patch("/:id",updatePayment)

paymentRouter.delete("/:id",removePayment)

export default paymentRouter;