import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import vehicleRouter from "./routes/vehicleRoute.js";
import clientRouter from "./routes/clientRoute.js";
import vehicleMaintenanceRouter from "./routes/vehicleMaintenanceRoute.js";
import vehicleCostRouter from "./routes/vehicleCostRoute.js";
import vehicleDamageRouter from "./routes/vehicleDamageRoute.js";
import rentRouter from "./routes/rentRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import authRouter from "./routes/authRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";


const app = express()
const PORT = 5005

app.use(express.json());
app.use(cookieParser());
app.use(cors({
      origin:"http://localhost:5173",
      credentials:true
}))

app.use("/api/auth",authRouter);
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
