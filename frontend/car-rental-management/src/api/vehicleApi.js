import api from "./axios.js";
import { handleApiError } from "../utils/handleError.js";

export const registerVehicle = async (data) => {
  try {
    const response = await api.post("/vehicles", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAllVehiclesAvailable = async () => {
  try {
    const response = await api.get("/vehicles/available");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAllVehicles = async () => {
  try {
    const response = await api.get("/vehicles");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateVehicle = async (id, data) => {
  try {
    const response = await api.patch(`/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const removeVehicle = async (id) => {
  try {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const vehicleImageUrl = (fileName) => {
  if (!fileName) return "";
  return `${api.defaults.baseURL}/vehicles/uploads/${fileName}`;
};
