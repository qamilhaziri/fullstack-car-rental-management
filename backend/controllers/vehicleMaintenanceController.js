import vehicleMaintenanceModel from "../models/vehicleMaintenanceModel.js";

export const registerVehicleMaintenance = async (req,res) => {
   try{
      const id = req.params.id;
      await vehicleMaintenanceModel.registerVehicleMaintenance(id,req.body);
     
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
      const maintenances = await vehicleMaintenanceModel.getAllMaintenanceByVehicleId(req.params.id);
    
      res.json(maintenances);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}


export const updateVehicleMaintenance = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const maintenances = await vehicleMaintenanceModel.updateVehicleMaintenance(id,data);
      
      res.json(maintenances)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeVehicleMaintenance = async(req,res) => {
   try{
      const id = req.params.id;

      const maintenances = await vehicleMaintenanceModel.removeVehicleMaintenance(id);
      
      res.status(204).json(maintenances)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}