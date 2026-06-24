import { registerVehicleDamage, getDamageByVehicleId, getDamageByClientId, removeVehicleDamage, updateVehicleDamage } from "../controllers/vehicleDamageController.js";
import express from "express"
import { updateVehicleDamageSchema, vehicleDamageSchema } from "../validators/vehicleDamageValidator.js";
import { validate } from "../middleware/validate.js";

const vehicleDamageRouter = express.Router();

vehicleDamageRouter.post("/",validate(vehicleDamageSchema),registerVehicleDamage)

vehicleDamageRouter.get("/vehicle/:id",getDamageByVehicleId);

vehicleDamageRouter.get("/client/:id",getDamageByClientId);

vehicleDamageRouter.patch("/:id",validate(updateVehicleDamageSchema),updateVehicleDamage);

vehicleDamageRouter.delete("/:id",removeVehicleDamage);

export default vehicleDamageRouter;