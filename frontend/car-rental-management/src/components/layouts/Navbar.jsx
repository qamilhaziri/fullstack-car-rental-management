import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, logoutHandle } = useAuth();

  const handleLogout = async () => {
    await logoutHandle();
    navigate("/login");
  };

  const userName = user?.fullName || user?.full_name || (user?.user_id ? `Admin #${user.user_id}` : "Admin");

  return (
    <header className="flex flex-col gap-3 border-b border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h1 className="text-xl font-semibold text-slate-950">{userName}</h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-fit rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;
