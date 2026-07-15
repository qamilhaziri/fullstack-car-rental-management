import vehicleMaintenanceModel from "../models/vehicleMaintenanceModel.js";
import redis from "../config/redisConfig.js";

const maintenanceByVehicleKey = (id) => `vehicle-maintenances:vehicle:${id}`;

async function invalidateVehicleMaintenanceCache(vehicleId) {
   if (redis.isOpen && vehicleId) {
      await redis.del(maintenanceByVehicleKey(vehicleId));
   }
}

export const registerVehicleMaintenance = async (req,res) => {
   try{
      const id = req.params.id;
      await vehicleMaintenanceModel.registerVehicleMaintenance(id,req.body);
      await invalidateVehicleMaintenanceCache(id);
     
      return res.status(201).json({
         message: "Vehicle maintenance inserted successfully"
      });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getAllMaintenanceByVehicleId = async (req,res) => {
   try{
      const id = req.params.id;

      if (redis.isOpen) {
         const cachedMaintenances = await redis.get(maintenanceByVehicleKey(id));

         if (cachedMaintenances) {
            return res.set("X-Cache", "HIT").json(JSON.parse(cachedMaintenances));
         }
      }

      const maintenances = await vehicleMaintenanceModel.getAllMaintenanceByVehicleId(id);

      if (redis.isOpen) {
         await redis.setEx(maintenanceByVehicleKey(id), 120, JSON.stringify(maintenances));
      }

      return res.set("X-Cache", "MISS").json(maintenances);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}


export const updateVehicleMaintenance = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;
      const previousMaintenance = await vehicleMaintenanceModel.getVehicleMaintenanceById(id);

      const maintenances = await vehicleMaintenanceModel.updateVehicleMaintenance(id,data);

      await invalidateVehicleMaintenanceCache(previousMaintenance?.vehicle_id);
      await invalidateVehicleMaintenanceCache(maintenances[0]?.vehicle_id);
      
      res.json(maintenances)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeVehicleMaintenance = async(req,res) => {
   try{
      const id = req.params.id;

      const maintenances = await vehicleMaintenanceModel.removeVehicleMaintenance(id);

      await invalidateVehicleMaintenanceCache(maintenances[0]?.vehicle_id);
      
      res.status(204).json(maintenances)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}
