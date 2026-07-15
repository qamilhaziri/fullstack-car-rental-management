import db from "../config/dbConfig.js"

const vehicleMaintenanceModel = {

    registerVehicleMaintenance: async (vehicle_id,vehicleMaintenance) => {

        const data = {
            ...vehicleMaintenance,
            vehicle_id
        };

       const result = await db("vehicle_maintenance")
                .insert(data)
                .returning("*");

        return result;

    }
    ,
    getAllMaintenanceByVehicleId: async (vehicle_id) => {
        return await db("vehicle_maintenance")
                        .where({vehicle_id});
    },

    getVehicleMaintenanceById: async (vmaintenance_id) => {
        return await db("vehicle_maintenance")
                        .where({ vmaintenance_id })
                        .first();
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
