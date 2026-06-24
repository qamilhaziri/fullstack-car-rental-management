import {login, logout, me} from "../controllers/authController.js";
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/loginValidator.js";

const authRouter = express.Router();

authRouter.post("/login",validate(loginSchema),loginLimiter,login);

authRouter.post("/logout",logout);

authRouter.post("/me",authMiddleware,me);

export default authRouter;