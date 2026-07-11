import db from "../config/dbConfig.js"

const rentModel = {

    registerRent: async (rent) => {
        const { vId, cId, date_rented,date_returned,date_to_return,is_returned  } = rent;

        await db.raw("Call register_rent(?,?,?,?,?,?)",[
           vId, cId, date_rented,date_returned,date_to_return,is_returned
        ])
    },

     getRentById : async (rent_id) => {
        return await db("rent")
                        .where({rent_id})
    }
    ,

    getRentsByClientId : async (client_id) => {
        return await db("rent as r")
                        .join("client as c","r.client_id","c.client_id")
                        .where("r.client_id",client_id)
    },
    
     getRentsByVehicleId : async (vehicle_id) => {
        return await db("rent as r")
                        .join("vehicle as v","r.vehicle_id","v.vehicle_id")
                        .where("r.vehicle_id",vehicle_id)
    },

    getRentsAllData : async () => {
        const result = await db.raw(`
                SELECT
                    v.model, b.brand,c.client_name,c.client_surname,r.*,
                    SUM(p.payment_amount) AS paidAmount
                FROM rent r
                JOIN vehicle v ON r.vehicle_id = v.vehicle_id
                JOIN brand b ON v.brand_id = b.brand_id
                JOIN client c ON r.client_id = c.client_id
                left JOIN payment p ON p.rent_id = r.rent_id
                GROUP BY
                    r.rent_id,
                    v.model,
                    b.brand,
                    c.client_name,
                    c.client_surname`);
        return result.rows;
    },

    updateRent: async(rent_id,data) => {
        const result = db("rent")
                        .where({rent_id})
                        .update(data)
                        .returning("*");
        return result;
    },

      removeRent: async(rent_id) => {
        const data = await db("rent")
                                .where({rent_id})
                                .del()
                                .returning("*");
        return data;
    }

}

export default rentModel