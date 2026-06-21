import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVehiclesAvailable } from "../api/vehicleApi";
import VehicleCard from "../components/ui/VehicleCard";

function Dashboard() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getAllVehiclesAvailable();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold">Available vehicles</h2>
            <p className="mt-2 text-sm text-slate-300">Vehicles ready to rent today.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-2xl font-semibold">{vehicles.length}</p>
              <p className="text-xs text-slate-300">Available</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-2xl font-semibold">
                {new Set(vehicles.map((vehicle) => vehicle.brand).filter(Boolean)).size}
              </p>
              <p className="text-xs text-slate-300">Brands</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-2xl font-semibold">
                {vehicles.length ? Math.min(...vehicles.map((vehicle) => Number(vehicle.cost_per_day || 0)).filter(Boolean)) : 0}
              </p>
              <p className="text-xs text-slate-300">Min/day</p>
            </div>
          </div>
        </div>
      </section>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading vehicles...</p> : null}

      {!loading && vehicles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No available vehicles.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.vehicle_id}
            vehicle={vehicle}
            actions={
              <button
                type="button"
                onClick={() => navigate(`/rents/register/${vehicle.vehicle_id}`)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Rent
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
