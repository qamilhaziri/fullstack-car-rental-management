import vehicleModel from "../models/vehicleModel.js";
import path from "path";
import redis from "../config/redisConfig.js";


async function invalidateVehicleCache (){
   if(redis.isOpen){
      await redis.del("vehicles:all");
   }
}

export const registerVehicle = async (req,res) => {
   try{
      const file_name = req.file ? req.file.filename : null;

      const data = {
         ...req.body,
         file_name
      }

      await vehicleModel.registerVehicle(data);

      await invalidateVehicleCache ();
     
     return res.status(201).json({
      message: "Vehicle inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getAllVehicles = async (req,res) => {
   try{

      if(redis.isOpen){
         const cachedVehicles = await redis.get("vehicles:all");

         if(cachedVehicles){
            return res.set("X-Cache","HIT").json(JSON.parse(cachedVehicles));
         }
      }
    const vehicles = await vehicleModel.getAllVehicles();
    
      if(redis.isOpen){
         await redis.setEx("vehicles:all",300,JSON.stringify(vehicles))
      }

    return res.set("X-Cache","MISS").json(vehicles);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}

export const getVehicleById = async (req,res) => {
   try{
      const id = req.params.id;

      const vehicle = await vehicleModel.getVehicleById(id);

      res.json(vehicle);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const getAllVehiclesAvailable = async (req,res) => {
   try{
    const vehicles = await vehicleModel.getAllVehiclesAvailable();
    
    res.json(vehicles);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}

export const getVehicleImage = (req,res) => {
   const filePath = path.join(process.cwd(),"public","uploads",req.params.filename);

   res.sendFile(filePath);
}

export const updateVehicle = async(req,res) => {
   try{
      const id = req.params.id;
      const data = {
         ...req.body,
         ...(req.file ? { file_name: req.file.filename } : {})
      };

      const vehicle = await vehicleModel.updateVehicle(id,data);
      
      await invalidateVehicleCache ();
      res.json(vehicle)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeVehicle = async(req,res) => {
   try{
      const id = req.params.id;

      const vehicle = await vehicleModel.removeVehicle(id);
      
     await  invalidateVehicleCache ();

      res.status(204).json(vehicle)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}
