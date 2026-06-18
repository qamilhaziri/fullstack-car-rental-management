import { registerVehicleMaintenance, getAllMaintenanceByVehicleId, updateVehicleMaintenance, removeVehicleMaintenance } from "../controllers/vehicleMaintenanceController.js";
import express from "express"

const vehicleMaintenanceRouter = express.Router();

vehicleMaintenanceRouter.post("/:id",registerVehicleMaintenance)

vehicleMaintenanceRouter.get("/:id",getAllMaintenanceByVehicleId);

vehicleMaintenanceRouter.patch("/:id",updateVehicleMaintenance);

vehicleMaintenanceRouter.delete("/:id",removeVehicleMaintenance);

export default vehicleMaintenanceRouter;