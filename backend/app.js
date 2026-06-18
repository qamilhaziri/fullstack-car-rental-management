import dotenv from "dotenv"
dotenv.config();

import express from "express"
import vehicleRouter from "./routes/vehicleRoute.js";

const app = express()
const PORT = 5005


app.use(express.json());

app.use("/api/vehicles",vehicleRouter)

app.listen(PORT, () => {
      console.log('The server is up and running: ' , 'http://localhost:5005')
})
