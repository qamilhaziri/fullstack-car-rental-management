import vehicleCostModel from "../models/vehicleCostModel.js";
import redis from "../config/redisConfig.js";

const vehicleCostKey = (id) => `vehicle-costs:${id}`;

async function invalidateVehicleCostCache(id) {
  if (redis.isOpen) {
    await redis.del([vehicleCostKey(id), "vehicles:all"]);
  }
}

export const registerVehicleCost = async (req,res) => {
   try{
     const cost = await vehicleCostModel.registerVehicleCost(req.body);
     
     return res.status(201).json({
      message: "Vehicle cost inserted successfully",
      cost
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getVehicleCostById = async (req,res) => {
   try{
      const id = req.params.id;

      if (redis.isOpen) {
         const cachedVehicleCost = await redis.get(vehicleCostKey(id));

         if (cachedVehicleCost) {
            return res.set("X-Cache", "HIT").json(JSON.parse(cachedVehicleCost));
         }
      }

      const vehicleCost = await vehicleCostModel.getVehicleCostById(id);

      if (redis.isOpen) {
         await redis.setEx(vehicleCostKey(id), 600, JSON.stringify(vehicleCost));
      }

      return res.set("X-Cache", "MISS").json(vehicleCost);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}

export const updateVehicleCost = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const vehicleCost = await vehicleCostModel.updateVehicleCost(id,data);

      await invalidateVehicleCostCache(id);
      
      res.json(vehicleCost)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const removeVehicleCost = async(req,res) => {
   try{
      const id = req.params.id;

      const vehicleCost = await vehicleCostModel.removeVehicleCost(id);

      await invalidateVehicleCostCache(id);
      
      res.status(204).json(vehicleCost)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}
