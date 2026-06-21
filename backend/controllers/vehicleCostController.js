import vehicleCostModel from "../models/vehicleCostModel.js";

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
      const vehicleCost = await vehicleCostModel.getVehicleCostById(id);
    
      res.json(vehicleCost);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}

export const updateVehicleCost = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const vehicleCost = await vehicleCostModel.updateVehicleCost(id,data);
      
      res.json(vehicleCost)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const removeVehicleCost = async(req,res) => {
   try{
      const id = req.params.id;

      const vehicleCost = await vehicleCostModel.removeVehicleCost(id);
      
      res.status(204).json(vehicleCost)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}
