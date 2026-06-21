import api from "./axios.js";
import { handleApiError } from "../utils/handleError.js";

export const registerVehicleCost = async (costData) => {
  try {
    const response = await api.post("/vehicleCost", costData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getVehicleCostById = async (id) => {
  try {
    const response = await api.get(`/vehicleCost/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateVehicleCost = async (id, costData) => {
  try {
    const response = await api.patch(`/vehicleCost/${id}`, costData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const removeVehicleCost = async (id) => {
  try {
    const response = await api.delete(`/vehicleCost/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
