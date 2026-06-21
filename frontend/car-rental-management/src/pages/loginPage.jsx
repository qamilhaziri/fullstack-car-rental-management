import { useState } from "react";
import { login } from "../api/authApi.js"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js";

function LoginPage() {

    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [error, setError] = useState("") 

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
            setError(error.message)
        }
    }

    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Login
      </h2>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          } required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          } required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && (
  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
    {error}
  </div>
)}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  </div>
);
}

export default LoginPage