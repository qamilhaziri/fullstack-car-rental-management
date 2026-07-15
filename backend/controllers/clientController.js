import clientModel from "../models/clientModel.js";
import redis from "../config/redisConfig.js";

const CLIENTS_KEY = "clients:all";
const clientKey = (id) => `clients:${id}`;

async function invalidateClientCache(id) {
   if (redis.isOpen) {
      const keys = [CLIENTS_KEY];

      if (id) keys.push(clientKey(id));

      await redis.del(keys);
   }
}

export const registerClient = async (req,res) => {
   try{
     await clientModel.registerClient(req.body);
     await invalidateClientCache();
     
     return res.status(201).json({
      message: "client inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getAllClients = async (req,res) => {
   try{
    if (redis.isOpen) {
      const cachedClients = await redis.get(CLIENTS_KEY);

      if (cachedClients) {
        return res.set("X-Cache", "HIT").json(JSON.parse(cachedClients));
      }
    }

    const clients = await clientModel.getAllClients();

    if (redis.isOpen) {
      await redis.setEx(CLIENTS_KEY, 300, JSON.stringify(clients));
    }

    return res.set("X-Cache", "MISS").json(clients);
   }catch(error){
        res.status(500).json({error: error.message});
   }
}

export const getClientById = async (req,res) => {
   try{
      const id = req.params.id;

      if (redis.isOpen) {
        const cachedClient = await redis.get(clientKey(id));

        if (cachedClient) {
          return res.set("X-Cache", "HIT").json(JSON.parse(cachedClient));
        }
      }

      const client = await clientModel.getClientById(id);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      if (redis.isOpen) {
        await redis.setEx(clientKey(id), 300, JSON.stringify(client));
      }

      return res.set("X-Cache", "MISS").json(client);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const updateClient = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const client = await clientModel.updateClient(id,data);

      await invalidateClientCache(id);
      
      res.json(client)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removeClient = async(req,res) => {
   try{
      const id = req.params.id;

      const client = await clientModel.removeClient(id);

      await invalidateClientCache(id);
      
      res.status(204).json(client)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}
