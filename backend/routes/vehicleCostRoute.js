import { registerVehicleCost, getVehicleCostById, updateVehicleCost,removeVehicleCost } from "../controllers/vehicleCostController.js";
import express from "express"

const vehicleCostRouter = express.Router();

vehicleCostRouter.post("/",registerVehicleCost)

vehicleCostRouter.get("/:id",getVehicleCostById);

vehicleCostRouter.patch("/:id",updateVehicleCost);

vehicleCostRouter.delete("/:id",removeVehicleCost);

export default vehicleCostRouter;