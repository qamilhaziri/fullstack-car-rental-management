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
      <section>
        <h2 className="text-2xl font-semibold text-slate-950">Available vehicles</h2>
        <p className="text-sm text-slate-500">Vehicles ready to rent today.</p>
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
