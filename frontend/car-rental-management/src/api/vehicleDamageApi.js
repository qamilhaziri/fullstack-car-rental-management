import api from "./axiosInstance";
import { handleApiError } from "../utils/handleError.js";

export const registerVehicleDamage = async (damageData) => {
    try {
        const response = await api.post(
            "/vehicleDamages",
            damageData
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const getDamageByVehicleId = async (vehicleId) => {
    try {
        const response = await api.get(
            `/vehicleDamages/vehicle/${vehicleId}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const getDamageByClientId = async (clientId) => {
    try {
        const response = await api.get(
            `/vehicleDamages/client/${clientId}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const updateVehicleDamage = async (
    damageId,
    damageData
) => {
    try {
        const response = await api.patch(
            `/vehicleDamages/${damageId}`,
            damageData
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const removeVehicleDamage = async (
    damageId
) => {
    try {
        const response = await api.delete(
            `/vehicleDamages/${damageId}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};