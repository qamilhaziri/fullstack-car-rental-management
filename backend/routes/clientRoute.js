import { getAllClients, getClientById, registerClient, removeClient, updateClient } from "../controllers/clientController.js";
import express from "express"

const clientRouter = express.Router();

clientRouter.post("/",registerClient)

clientRouter.get("/",getAllClients);

clientRouter.get("/:id",getClientById);

clientRouter.patch("/:id",updateClient);

clientRouter.delete("/:id",removeClient);

export default clientRouter;