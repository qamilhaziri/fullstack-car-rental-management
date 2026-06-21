import express from "express";
import { getAllBrands, registerBrand } from "../controllers/brandController.js";

const brandRouter = express.Router();

brandRouter.get("/", getAllBrands);
brandRouter.post("/", registerBrand);

export default brandRouter;
