import api from "./axios.js";
import { handleApiError } from "../utils/handleError.js";

export const getAllBrands = async () => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const registerBrand = async (brandData) => {
  try {
    const response = await api.post("/brands", brandData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
