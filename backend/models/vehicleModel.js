import db from "../config/dbConfig.js"

const vehicleModel = {

    registerVehicle: async (vehicle) => {
        const { brand_id, model, vehicle_type, transmission, color,
			   cost_id , doors, production_year, fuel_type,file_name } = vehicle;

        await db.raw("Call register_vehicle(?,?,?,?,?,?,?,?,?,?)",[
            brand_id, model, vehicle_type, transmission, color,
			cost_id , doors, production_year, fuel_type,file_name
        ])
    }
    ,
    getAllVehicles: async () => {
        return await db("vehicle as v")
                        .join("brand as b","v.brand_id","b.brand_id")
                        .join("vehicle_cost as vc","v.cost_id","vc.vcost_id")
                        .select( "v.*",
                                "b.brand",
                                "vc.cost_per_hour",
                                "vc.cost_per_day")
    },

    getVehicleById: async (vehicle_id) => {
        return await db("vehicle as v")
                    .join("brand as b","v.brand_id","b.brand_id")
                    .join("vehicle_cost as vc","v.cost_id","vc.vcost_id")
                    .select("v.*",
                            "b.brand",
                            "vc.cost_per_hour",
                            "vc.cost_per_day")
                    .where("v.vehicle_id",vehicle_id)
                    .first()
    },

    updateVehicle: async(vehicle_id,data) => {
        const result = db("vehicle")
                        .where({vehicle_id})
                        .update(data)
                        .returning("*");
        return result;
    },
    removeVehicle: async(vehicle_id) => {
        const data = await db("vehicle")
                                .where({vehicle_id})
                                .del()
                                .returning("*");
        return data;
    }


}

export default vehicleModel