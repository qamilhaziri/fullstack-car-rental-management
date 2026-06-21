import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import ClientPage from "../pages/clientPage";
import Dashboard from "../pages/dashboardPage";
import LoginPage from "../pages/loginPage";
import RentPage from "../pages/rentPage";
import VehiclePage from "../pages/vehiclePage";
import ProtectedRoute from "./protectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/rents" element={<RentPage />} />
        <Route path="/rents/register/:vehicleId" element={<RentPage mode="register" />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
