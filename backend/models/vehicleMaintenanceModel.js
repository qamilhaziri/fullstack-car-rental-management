import db from "../config/dbConfig.js"

const vehicleMaintenanceModel = {

    registerVehicleMaintenance: async (vehicle_id,vehicleMaintenance) => {

        vehicleMaintenance['vehicle_id'] = vehicle_id;

       const result = await db("vehicle_maintenance")
                .insert(vehicleMaintenance)
                .returning("*");

        return result;

    }
    ,
    getAllMaintenanceByVehicleId: async (vehicle_id) => {
        return await db("vehicle_maintenance")
                        .where({vehicle_id});
    },

    updateVehicleMaintenance: async(vmaintenance_id,data) => {
        const result = db("vehicle_maintenance")
                        .where({vmaintenance_id})
                        .update(data)
                        .returning("*");
        return result;
    },
    removeVehicleMaintenance: async(vmaintenance_id) => {
        const data = await db("vehicle_maintenance")
                                .where({vmaintenance_id})
                                .del()
                                .returning("*");
        return data;
    }

}

export default vehicleMaintenanceModel