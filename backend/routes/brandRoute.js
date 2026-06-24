import express from "express";
import { getAllBrands, registerBrand } from "../controllers/brandController.js";
import { validate } from "../middleware/validate.js";
import { brandSchema } from "../validators/brandValidator.js";

const brandRouter = express.Router();

brandRouter.get("/", getAllBrands);
brandRouter.post("/",validate(brandSchema), registerBrand);

export default brandRouter;
