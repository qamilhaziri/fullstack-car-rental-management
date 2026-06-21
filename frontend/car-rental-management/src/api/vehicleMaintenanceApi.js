import api from "./axios.js";
import { handleApiError } from "../utils/handleError.js";

export const getAllMaintenanceByVehicleId = async (vehicleId) => {
  try {
    const response = await api.get(`/vehicleMaintenances/${vehicleId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const registerVehicleMaintenance = async (vehicleId, maintenanceData) => {
  try {
    const response = await api.post(`/vehicleMaintenances/${vehicleId}`, maintenanceData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateVehicleMaintenance = async (maintenanceId, maintenanceData) => {
  try {
    const response = await api.patch(`/vehicleMaintenances/${maintenanceId}`, maintenanceData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const removeVehicleMaintenance = async (maintenanceId) => {
  try {
    const response = await api.delete(`/vehicleMaintenances/${maintenanceId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
