
import api from "./axios.js";



export const login = async (data) => {
    try{
        const response = await api.post("/auth/login",data);
        return response.data;

    }catch(error){
        throw {
            status: error.response?.status,
            message: error.response?.data?.message 
        }
    }
}

export const logout = async () => {
    const response = await api.post("/auth/logout")
    return response.data;
}

export const getCurrentUser = async () => {
    const response = await api.post("/auth/me")
    return response.data;
}
