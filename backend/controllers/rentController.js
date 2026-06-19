import rentModel from "../models/rentModel.js";

export const registerRent = async (req,res) => {
   try{
     await rentModel.registerRent(req.body);
     
     return res.status(201).json({
      message: "Rent inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getRentById = async (req,res) => {
   try{
      const id = req.params.id;

      const rent = await rentModel.getRentById(id);

      res.json(rent);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const getRentsByClientId = async (req,res) => {
   try{
      const id = req.params.id;

      const rents = await rentModel.getRentsByClientId(id);

      res.json(rents);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const getRentsByVehicleId = async (req,res) => {
   try{
      const id = req.params.id;

      const rents = await rentModel.getRentsByVehicleId(id);

      res.json(rents);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const updateRent = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const rent = await rentModel.updateRent(id,data);
      
      res.json(rent)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeRent = async(req,res) => {
   try{
      const id = req.params.id;

      const data = await rentModel.removeRent(id);
      
      res.status(204).json(data)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}