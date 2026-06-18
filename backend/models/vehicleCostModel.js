import db from "../config/dbConfig.js"

const vehicleModel = {

    registerVehicleCost: async (vehicleCost) => {
        const { cost_per_hour, cost_per_day } = vehicleCost;

        await db.raw("Call register_vehiclecost(?,?)",[
            cost_per_hour, cost_per_day
        ])
    }
    ,

    getVehicleCostById: async (vcost_id) => {
        return await db("vehicle_cost")
                        .where({vcost_id})
                    
    },

    updateVehicleCost: async(vcost_id,data) => {
        const result = db("vehicle_cost")
                        .where({vcost_id})
                        .update(data)
                        .returning("*");
        return result;
    },
     removeVehicleCost: async(vcost_id) => {
        const data = await db("vehicle_cost")
                                .where({vcost_id})
                                .del()
                                .returning("*");
        return data;
    }

}

export default vehicleModel