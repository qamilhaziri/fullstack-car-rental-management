import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clients", label: "Clients" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/rents", label: "Rents" },
];

function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 px-4 py-4 text-white md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-64 md:overflow-y-auto md:border-b-0 md:border-r md:border-slate-800">
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-sm font-bold text-slate-950">
          CR
        </div>
        <p className="text-lg font-semibold">Car Rental</p>
        <p className="text-sm text-slate-300">Management system</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-950/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300 md:block">
        <p className="font-medium text-white">Daily workspace</p>
        <p className="mt-1 leading-5">Vehicles, clients, rents and payments stay one click away.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
