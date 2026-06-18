import dotenv from "dotenv"
dotenv.config();

import express from "express"
import vehicleRouter from "./routes/vehicleRoute.js";
import clientRouter from "./routes/clientRoute.js";
import vehicleMaintenanceRouter from "./routes/vehicleMaintenanceRoute.js";
import vehicleCostRouter from "./routes/vehicleCostRoute.js";
import vehicleDamageRouter from "./routes/vehicleDamageRoute.js";

const app = express()
const PORT = 5005

app.use(express.json());

app.use("/api/vehicles",vehicleRouter)
app.use("/api/clients",clientRouter)
app.use("/api/vehicleMaintenances",vehicleMaintenanceRouter)
app.use("/api/vehicleCost",vehicleCostRouter)
app.use("/api/vehicleDamages",vehicleDamageRouter)

app.listen(PORT, () => {
      console.log('The server is up and running: ' , 'http://localhost:5005')
})
