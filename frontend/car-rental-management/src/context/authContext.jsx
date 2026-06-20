import { useEffect } from "react";
import { createContext, useState } from "react";
import {getCurrentUser,logout} from "../api/authApi.js"

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const[user,setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try{
                const res = await getCurrentUser();
                setUser(res.user);

            }catch{
                setUser(null);
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
                logoutHandle
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}