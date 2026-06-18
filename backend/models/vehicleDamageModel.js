import db from "../config/dbConfig.js"

const vehicleDamageModel = {

    registerVehicleDamage: async (vehicleDamage) => {
        const { client_id , vehicle_id , damage , other_info ,date_of_damage  } = vehicleDamage;

        await db.raw("Call register_vehicleDamage(?,?,?,?,?)",[
            client_id , vehicle_id , damage , other_info ,date_of_damage
        ])
    }
    ,

    getDamageByVehicleId: async (vehicle_id) => {
        return await db("vehicle_damage as vd")
                    .join("vehicle as v","vd.vehicle_id","v.vehicle_id")
                    .join("client as c","vd.client_id","c.client_id")
                    .select("vd.damage",
                            "vd.other_info",
                            "vd.date_of_damage",
                            "c.client_name",
                            "v.model",
                            "v.vehicle_type")
                    .where("vd.vehicle_id",vehicle_id)
                    
    },
     getDamageByClientId: async (client_id) => {
        return await db("vehicle_damage as vd")
                    .join("vehicle as v","vd.vehicle_id","v.vehicle_id")
                    .join("client as c","vd.client_id","c.client_id")
                    .select("vd.damage",
                            "vd.other_info",
                            "vd.date_of_damage",
                            "c.client_name",
                            "v.model",
                            "v.vehicle_type")
                    .where("vd.client_id",client_id)
                    
    },

    updateVehicleDamage: async(vdamage_id,data) => {
        const result = db("vehicle_damage")
                        .where({vdamage_id})
                        .update(data)
                        .returning("*");
        return result;
    },
    removeVehicleDamage: async(vdamage_id) => {
        const data = await db("vehicle_damage")
                                .where({vdamage_id})
                                .del()
                                .returning("*");
        return data;
    }


}

export default vehicleDamageModel