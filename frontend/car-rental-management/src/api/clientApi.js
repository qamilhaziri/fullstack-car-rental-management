import api from "./axiosInstance";
import { handleApiError } from "../utils/handleApiError";

// GET all clients
export const getAllClients = async () => {
    try {
        const response = await api.get("/clients");

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const getClientById = async (id) => {
    try {
        const response = await api.get(`/clients/${id}`);

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const registerClient = async (clientData) => {
    try {
        const response = await api.post(
            "/clients",
            clientData
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const updateClient = async (id, clientData) => {
    try {
        const response = await api.patch(
            `/clients/${id}`,
            clientData
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const removeClient = async (id) => {
    try {
        const response = await api.delete(
            `/clients/${id}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};