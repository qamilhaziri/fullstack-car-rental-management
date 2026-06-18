import clientModel from "../models/clientModel.js";

export const registerClient = async (req,res) => {
   try{
     await clientModel.registerClient(req.body);
     
     return res.status(201).json({
      message: "client inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getAllClients = async (req,res) => {
   try{
    const clients = await clientModel.getAllClients();
    
    res.json(clients);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}

export const getClientById = async (req,res) => {
   try{
      const id = req.params.id;

      const client = await clientModel.getClientById(id);

      res.json(client);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const updateClient = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const client = await clientModel.updateClient(id,data);
      
      res.json(client)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeClient = async(req,res) => {
   try{
      const id = req.params.id;

      const client = await clientModel.removeClient(id);
      
      res.status(204).json(client)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}