import {  registerRent,getRentById,getRentsByClientId,getRentsByVehicleId,updateRent,removeRent } from "../controllers/rentController.js";
import express from "express"

const rentRouter = express.Router();

rentRouter.post("/",registerRent);

rentRouter.get("/:id",getRentById)

rentRouter.get("/client/:id",getRentsByClientId);

rentRouter.get("/vehicle/:id",getRentsByVehicleId);

rentRouter.patch("/:id",updateRent)

rentRouter.delete("/:id",removeRent)

export default rentRouter;