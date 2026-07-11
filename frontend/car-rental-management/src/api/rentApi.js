import api from "./axios.js";
import { handleApiError } from "../utils/handleError.js";

export const registerRent = async (rentData) => {
  try {
    const response = await api.post("/rent", rentData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRentById = async (rentId) => {
  try {
    const response = await api.get(`/rent/${rentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRentsAllData = async () => {
  try {
    const response = await api.get(`/rent`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRentsByClientId = async (clientId) => {
  try {
    const response = await api.get(`/rent/client/${clientId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRentsByVehicleId = async (vehicleId) => {
  try {
    const response = await api.get(`/rent/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateRent = async (rentId, rentData) => {
  try {
    const response = await api.patch(`/rent/${rentId}`, rentData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const removeRent = async (rentId) => {
  try {
    const response = await api.delete(`/rent/${rentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
