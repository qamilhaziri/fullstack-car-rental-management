import vehicleModel from "../models/vehicleModel.js";

export const registerVehicle = async (req,res) => {
   try{
     await vehicleModel.registerVehicle(req.body);
     
     return res.status(201).json({
      message: "Vehicle inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getAllVehicles = async (req,res) => {
   try{
    const vehicles = await vehicleModel.getAllVehicles();
    
    res.json(vehicles);
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

export const updateVehicle = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const vehicle = await vehicleModel.updateVehicle(id,data);
      
      res.json(vehicle)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeVehicle = async(req,res) => {
   try{
      const id = req.params.id;

      const vehicle = await vehicleModel.removeVehicle(id);
      
      res.status(204).json(vehicle)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}