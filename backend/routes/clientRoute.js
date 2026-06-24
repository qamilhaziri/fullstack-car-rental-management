import { getAllClients, getClientById, registerClient, removeClient, updateClient } from "../controllers/clientController.js";
import express from "express"
import { validate } from "../middleware/validate.js";
import { clientSchema, updateClientSchema } from "../validators/clientValidator.js";

const clientRouter = express.Router();

clientRouter.post("/",validate(clientSchema),registerClient)

clientRouter.get("/",getAllClients);

clientRouter.get("/:id",getClientById);

clientRouter.patch("/:id",validate(updateClientSchema),updateClient);

clientRouter.delete("/:id",removeClient);

export default clientRouter;