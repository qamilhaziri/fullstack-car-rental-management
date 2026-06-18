import { registerVehicleDamage, getDamageByVehicleId, getDamageByClientId, removeVehicleDamage, updateVehicleDamage } from "../controllers/vehicleDamageController.js";
import express from "express"

const vehicleDamageRouter = express.Router();

vehicleDamageRouter.post("/",registerVehicleDamage)

vehicleDamageRouter.get("/vehicle/:id",getDamageByVehicleId);

vehicleDamageRouter.get("/client/:id",getDamageByClientId);

vehicleDamageRouter.patch("/:id",updateVehicleDamage);

vehicleDamageRouter.delete("/:id",removeVehicleDamage);

export default vehicleDamageRouter;