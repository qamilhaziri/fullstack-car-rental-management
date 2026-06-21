import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../api/authApi.js";
import { AuthContext } from "./authContextValue.js";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    },[])

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
