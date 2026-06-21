import db from "../config/dbConfig.js"

const paymentModel = {

    registerPayment: async (payment) => {
        const { rent_id, payment_amount, date_payment } = payment;

        await db.raw("Call register_payment(?,?,?)",[
          rent_id, payment_amount, date_payment
        ])
    },

    getPaymentByRentId : async (rent_id) => {
        return await db("payment as p")
                        .join("rent as r","p.rent_id","r.rent_id")
                        .where("p.rent_id",rent_id)
    },
    
     getPaymentById : async (payment_id) => {
        return await db("payment")
                        .where({payment_id})
    },

    updatePayment: async(payment_id,data) => {
        const result = db("payment")
                        .where({payment_id})
                        .update(data)
                        .returning("*");
        return result;
    },

      removePayment: async(payment_id) => {
        const data = await db("payment")
                                .where({payment_id})
                                .del()
                                .returning("*");
        return data;
    }

}

export default paymentModel