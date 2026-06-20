import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

            {/* nëse ke user */}
            {user.fullname && (
                <p>
                    Logged in as: <b>{user.email}</b>
                </p>
            )}

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;