import { getAllVehicles, getVehicleById, registerVehicle, removeVehicle, updateVehicle,getAllVehiclesAvailable } from "../controllers/vehicleController.js";
import express from "express"

const vehicleRouter = express.Router();

vehicleRouter.post("/",registerVehicle)

vehicleRouter.get("/",getAllVehicles);

vehicleRouter.get("/available",getAllVehiclesAvailable);

vehicleRouter.get("/:id",getVehicleById);

vehicleRouter.patch("/:id",updateVehicle);

vehicleRouter.delete("/:id",removeVehicle);

export default vehicleRouter;