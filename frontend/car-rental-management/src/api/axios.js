import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005/api",
    withCredentials : true
})

let refreshPromise = null;
let isRedirectingToLogin = false;
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        const isAuthRequest =  originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

      if(status !== 401 || originalRequest._retry || isAuthRequest){
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try{
        if(!refreshPromise){
            refreshPromise = api.post("/auth/refresh")
                            .finally(() => {
                                refreshPromise = null
                            });
        }

        await refreshPromise;

        return api(originalRequest);
      }catch (refreshError) {
        if (!isRedirectingToLogin && window.location.pathname !== "/login") {
          isRedirectingToLogin = true;
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }
)



export default api;
