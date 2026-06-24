import { registerVehicleCost, getVehicleCostById, updateVehicleCost,removeVehicleCost } from "../controllers/vehicleCostController.js";
import express from "express"
import { validate } from "../middleware/validate.js";
import { updateVehicleCostSchema, vehicleCostSchema } from "../validators/vehicleCostValidator.js";

const vehicleCostRouter = express.Router();

vehicleCostRouter.post("/",validate(vehicleCostSchema),registerVehicleCost)

vehicleCostRouter.get("/:id",getVehicleCostById);

vehicleCostRouter.patch("/:id",validate(updateVehicleCostSchema),updateVehicleCost);

vehicleCostRouter.delete("/:id",removeVehicleCost);

export default vehicleCostRouter;