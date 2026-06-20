import { Routes, Route } from "react-router-dom"
import LoginPage from "../pages/loginPage"
import Dashboard from "../pages/dashboardPage"
import ProtectedRoute from "./protectedRoute"

function AppRoutes() {

    return (
        <Routes>

            <Route path="/login" element={<LoginPage/>}></Route>

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        </Routes>
    )
} 

export default AppRoutes