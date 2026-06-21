import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../components/ui/VehicleCard";
function Dashboard() {

    const { user, logoutHandle } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutHandle();
        navigate("/login");
    };

    return (
        <div style={{ padding: "20px" }}>
            
            <h1>Dashboard</h1>

            <p>Welcome!</p>

           
            {user.fullName && (
                <p>
                    Logged in as: <b>{user.fullName}</b>
                </p>
            )}

            <button onClick={handleLogout}>
                Logout
            </button>

  
        </div>
    );
}

export default Dashboard;