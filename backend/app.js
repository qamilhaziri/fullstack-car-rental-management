import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import helmet from "helmet"
import vehicleRouter from "./routes/vehicleRoute.js";
import clientRouter from "./routes/clientRoute.js";
import vehicleMaintenanceRouter from "./routes/vehicleMaintenanceRoute.js";
import vehicleCostRouter from "./routes/vehicleCostRoute.js";
import vehicleDamageRouter from "./routes/vehicleDamageRoute.js";
import rentRouter from "./routes/rentRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import authRouter from "./routes/authRoute.js";
import brandRouter from "./routes/brandRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";
import {generalLimiter} from "./middleware/rateLimit.js";


const app = express()
const PORT = 5005
console.log(process.env.CLIENT_URL)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
      origin:process.env.CLIENT_URL,
      credentials:true
}))
 app.use(helmet({
      crossOriginResourcePolicy: {
            policy: "cross-origin",
    }
 }));
app.use(generalLimiter)

app.use((error,req,res,next) => {
      res.status(500).json({
            message: "Internal server error"
      })
})

app.use("/api/auth",authRouter);
app.use("/api/brands",authMiddleware,generalLimiter,brandRouter)
app.use("/api/vehicles",authMiddleware,vehicleRouter)
app.use("/api/clients",authMiddleware,clientRouter)
app.use("/api/vehicleMaintenances",authMiddleware,vehicleMaintenanceRouter)
app.use("/api/vehicleCost",authMiddleware,vehicleCostRouter)
app.use("/api/vehicleDamages",authMiddleware,vehicleDamageRouter)
app.use("/api/rent",authMiddleware,rentRouter)
app.use("/api/payment",authMiddleware,paymentRouter)


app.listen(PORT, () => {
      console.log('The server is up and running: ' , 'http://localhost:5005')
})
