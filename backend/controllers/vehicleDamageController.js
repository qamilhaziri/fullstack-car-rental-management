import vehicleDamageModel from "../models/vehicleDamageModel.js";
import redis from "../config/redisConfig.js";

const damageByVehicleKey = (id) => `vehicle-damages:vehicle:${id}`;
const damageByClientKey = (id) => `vehicle-damages:client:${id}`;

async function invalidateVehicleDamageCache(damage) {
   if (!redis.isOpen || !damage) return;

   await redis.del([
      damageByVehicleKey(damage.vehicle_id),
      damageByClientKey(damage.client_id),
   ]);
}

export const registerVehicleDamage = async (req,res) => {
   try{
     await vehicleDamageModel.registerVehicleDamage(req.body);
     await invalidateVehicleDamageCache(req.body);
     
     return res.status(201).json({
      message: "Vehicle damage inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}


export const getDamageByVehicleId = async (req,res) => {
   try{
      const id = req.params.id;

      if (redis.isOpen) {
         const cachedDamage = await redis.get(damageByVehicleKey(id));

         if (cachedDamage) {
            return res.set("X-Cache", "HIT").json(JSON.parse(cachedDamage));
         }
      }

      const vehicleDamage = await vehicleDamageModel.getDamageByVehicleId(id);

      if (redis.isOpen) {
         await redis.setEx(damageByVehicleKey(id), 120, JSON.stringify(vehicleDamage));
      }

      return res.set("X-Cache", "MISS").json(vehicleDamage);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const getDamageByClientId = async (req,res) => {
   try{
      const id = req.params.id;

      if (redis.isOpen) {
         const cachedDamage = await redis.get(damageByClientKey(id));

         if (cachedDamage) {
            return res.set("X-Cache", "HIT").json(JSON.parse(cachedDamage));
         }
      }

      const vehicleDamage = await vehicleDamageModel.getDamageByClientId(id);

      if (redis.isOpen) {
         await redis.setEx(damageByClientKey(id), 120, JSON.stringify(vehicleDamage));
      }

      return res.set("X-Cache", "MISS").json(vehicleDamage);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const updateVehicleDamage = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;
      const previousDamage = await vehicleDamageModel.getVehicleDamageById(id);
      
      const vehicleDamage = await vehicleDamageModel.updateVehicleDamage(id,data);

      await invalidateVehicleDamageCache(previousDamage);
      await invalidateVehicleDamageCache(vehicleDamage[0]);

      res.json(vehicleDamage)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeVehicleDamage = async(req,res) => {
   try{
      const id = req.params.id;

      const vehicleDamage = await vehicleDamageModel.removeVehicleDamage(id);

      await invalidateVehicleDamageCache(vehicleDamage[0]);
      
      res.status(204).json(vehicleDamage)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}
