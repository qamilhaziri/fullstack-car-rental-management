import { getAllVehicles, getVehicleById, registerVehicle, removeVehicle, updateVehicle,getAllVehiclesAvailable, getVehicleImage } from "../controllers/vehicleController.js";
import express from "express"
import upload from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { updateVehicleSchema, vehicleSchema } from "../validators/vehicleValidator.js";

const vehicleRouter = express.Router();

vehicleRouter.post("/",validate(vehicleSchema),upload.single("image"),registerVehicle)

vehicleRouter.get("/",getAllVehicles);

vehicleRouter.get("/available",getAllVehiclesAvailable);

vehicleRouter.get("/:id",getVehicleById);

vehicleRouter.get("/uploads/:filename",getVehicleImage)

vehicleRouter.patch("/:id",validate(updateVehicleSchema),upload.single("image"),updateVehicle);

vehicleRouter.delete("/:id",removeVehicle);

export default vehicleRouter;
