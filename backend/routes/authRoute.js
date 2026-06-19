import {login, logout, me} from "../controllers/authController.js";
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login",login);

authRouter.post("/logout",logout);

authRouter.post("/me",authMiddleware,me);

export default authRouter;