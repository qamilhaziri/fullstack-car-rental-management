import api from "./axiosInstance";
import { handleApiError } from "../utils/handleApiError";

export const registerPayment = async (paymentData) => {
    try {
        const response = await api.post(
            "/payment",
            paymentData
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const getPaymentById = async (id) => {
    try {
        const response = await api.get(
            `/payment/${id}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const getPaymentByRentId = async (rentId) => {
    try {
        const response = await api.get(
            `/payment/rent/${rentId}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const updatePayment = async (id, paymentData) => {
    try {
        const response = await api.patch(
            `/payment/${id}`,
            paymentData
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};

export const removePayment = async (id) => {
    try {
        const response = await api.delete(
            `/payment/${id}`
        );

        return response.data;

    } catch (error) {
        handleApiError(error);
    }
};