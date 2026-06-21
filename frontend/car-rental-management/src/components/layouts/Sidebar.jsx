import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clients", label: "Clients" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/rents", label: "Rents" },
];

function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-slate-950 px-4 py-4 text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-slate-800">
      <div className="mb-8 rounded-xl bg-white/10 p-4">
        <p className="text-lg font-semibold">Car Rental</p>
        <p className="text-sm text-slate-300">Management</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
