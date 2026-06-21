import api from "./axios.js"


export const registerVehicle = async (data) => {
    try{
        const response = await api.post("/vehicles",data);

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}

export const getAllVehiclesAvailable = async () => {
    try{
        const response = await api.get("/vehicles/available");

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}

export const getAllVehicles = async () => {
    try{
        const response = await api.get("/vehicles");

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}

export const getVehicleById = async (id) => {
    try{
        const response = await api.get(`/vehicles/${id}`);

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}

export const getVehicleImage = async (fileName) => {
    try{
        const response = await api.get(`/vehicles/uploads/${fileName}`);

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}

export const updateVehicle = async (id) => {
    try{
        const response = await api.patch(`/vehicles/${id}`);

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}


export const removeVehicle = async (id) => {
    try{
        const response = await api.delete(`/vehicles/${id}`);

        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}