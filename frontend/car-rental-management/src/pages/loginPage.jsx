import { useState } from "react";
import { login } from "../api/authApi.js"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js";

function LoginPage() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const[ formData,setFormData ] = useState({
        email: "",
        password:""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await login(formData);
            setUser(res.user);

            navigate("/dashboard");

        }catch(error){
            console.log(error)
        }
    }

    return(
        <form onSubmit={handleSubmit} className="bg-blue-500">
            <input placeholder="Email" onChange={(e) => {
                setFormData({...formData, email: e.target.value})
            }}/>
             <input placeholder="Password" onChange={(e) => {
                setFormData({...formData, password: e.target.value})
            }}/>
            <button>Login</button>
        </form>
    )
}

export default LoginPage