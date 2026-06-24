import {  registerRent,getRentById,getRentsByClientId,getRentsByVehicleId,updateRent,removeRent } from "../controllers/rentController.js";
import express from "express"
import { rentSchema, updateRentSchema } from "../validators/rentValidator.js";
import { validate } from "../middleware/validate.js";

const rentRouter = express.Router();

rentRouter.post("/",validate(rentSchema),registerRent);

rentRouter.get("/:id",getRentById)

rentRouter.get("/client/:id",getRentsByClientId);

rentRouter.get("/vehicle/:id",getRentsByVehicleId);

rentRouter.patch("/:id",validate(updateRentSchema),updateRent)

rentRouter.delete("/:id",removeRent)

export default rentRouter;