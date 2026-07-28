import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../api/authApi.js";
import { AuthContext } from "./authContextValue.js";
import { useLocation } from "react-router-dom";

export const AuthProvider = ({ children }) => {

    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => location.pathname !== "/login");

   useEffect(() => {

        if(location.pathname === "/login"){
            return;
        }
        const loadUser = async () => {
            try{
                const res = await getCurrentUser();
                setUser(res.user);
            }catch{
                setUser(null);
            }finally{
                setLoading(false);
            }
        }
        loadUser();
    },[location.pathname])

    const logoutHandle = async () => {
        try{
            await logout();
            setUser(null);
        }catch(err){
            console.log(err)
        }
    }

    return( 
        <AuthContext.Provider 
            value={{
                user,
                setUser,
                loading,
                logoutHandle
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
