import { registerVehicleMaintenance, getAllMaintenanceByVehicleId, updateVehicleMaintenance, removeVehicleMaintenance } from "../controllers/vehicleMaintenanceController.js";
import express from "express"
import { validate } from "../middleware/validate.js";
import { updateVehicleMaintenanceSchema, vehicleMaintenanceSchema } from "../validators/vehicleMaintenanceValidator.js";

const vehicleMaintenanceRouter = express.Router();

vehicleMaintenanceRouter.post("/:id",validate(vehicleMaintenanceSchema),registerVehicleMaintenance)

vehicleMaintenanceRouter.get("/:id",getAllMaintenanceByVehicleId);

vehicleMaintenanceRouter.patch("/:id",validate(updateVehicleMaintenanceSchema),updateVehicleMaintenance);

vehicleMaintenanceRouter.delete("/:id",removeVehicleMaintenance);

export default vehicleMaintenanceRouter;
