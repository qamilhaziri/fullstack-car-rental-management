import { getAllVehicles, getVehicleById, registerVehicle, removeVehicle, updateVehicle } from "../controllers/vehicleController.js";
import express from "express"

const vehicleRouter = express.Router();

vehicleRouter.post("/",registerVehicle)

vehicleRouter.get("/",getAllVehicles);

vehicleRouter.get("/:id",getVehicleById);

vehicleRouter.patch("/:id",updateVehicle);

vehicleRouter.delete("/:id",removeVehicle);

export default vehicleRouter;