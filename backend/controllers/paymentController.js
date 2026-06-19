import paymentModel from "../models/paymentModel.js";

export const registerPayment = async (req,res) => {
   try{
     await paymentModel.registerPayment(req.body);
     
     return res.status(201).json({
      message: "Payment inserted successfully"
    });

   }catch(error){
       res.status(500).json({error: error.message});
   }
}

export const getPaymentByRentId = async (req,res) => {
   try{
      const id = req.params.id;

      const payment = await paymentModel.getPaymentByRentId(id);

      res.json(payment);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const getPaymentById = async (req,res) => {
   try{
      const id = req.params.id;

      const payment = await paymentModel.getPaymentById(id);

      res.json(payment);
   }catch(error){
      res.status(500).json({error: error.message});
   }
}

export const updatePayment = async(req,res) => {
   try{
      const id = req.params.id;
      const data = req.body;

      const payment = await paymentModel.updatePayment(id,data);
      
      res.json(payment)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}


export const removePayment = async(req,res) => {
   try{
      const id = req.params.id;

      const data = await paymentModel.removePayment(id);
      
      res.status(204).json(data)
   }catch(error){
      res.status(500).json({error: error.message});
   }
}