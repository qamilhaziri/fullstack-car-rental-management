import vehicleDamageModel from "../models/vehicleDamageModel.js";

export const registerVehicleDamage = async (req,res) => {
   try{
     await vehicleDamageModel.registerVehicleDamage(req.body);
     
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

      const vehicleDamage = await vehicleDamageModel.getDamageByVehicleId(id);

      res.json(vehicleDamage);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const getDamageByClientId = async (req,res) => {
   try{
      const id = req.params.id;

      const vehicleDamage = await vehicleDamageModel.getDamageByClientId(id);

      res.json(vehicleDamage);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const updateVehicleDamage = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const vehicleDamage = await vehicleDamageModel.updateVehicleDamage(id,data);
      
      res.json(vehicleDamage)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeVehicleDamage = async(req,res) => {
   try{
      const id = req.params.id;

      const vehicleDamage = await vehicleDamageModel.removeVehicleDamage(id);
      
      res.status(204).json(vehicleDamage)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}