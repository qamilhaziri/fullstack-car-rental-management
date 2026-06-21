import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../api/clientApi";
import { getAllVehicles } from "../api/vehicleApi";
import RegisterVehicle from "../components/ui/registerVehicle";
import RegisterVehicleDamage from "../components/ui/registerVehicleDamage";
import RegisterVehicleMaintenance from "../components/ui/registerVehicleMaintenance";
import VehicleCard from "../components/ui/VehicleCard";

const tabs = [
  { key: "vehicle", label: "Register vehicle" },
  { key: "damage", label: "Register damage" },
  { key: "maintenance", label: "Register maintenance" },
];

function VehiclePage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("vehicle");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [vehicleData, clientData] = await Promise.all([getAllVehicles(), getAllClients()]);
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      setClients(Array.isArray(clientData) ? clientData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        const [vehicleData, clientData] = await Promise.all([getAllVehicles(), getAllClients()]);
        if (!ignore) {
          setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
          setClients(Array.isArray(clientData) ? clientData : []);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  const openTab = (tab, vehicleId = "") => {
    setSelectedVehicleId(vehicleId);
    if (tab !== "vehicle") setEditingVehicle(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setActiveTab("vehicle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearEdit = () => {
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-950">Vehicles</h2>
        <p className="text-sm text-slate-500">Manage vehicles, damage and maintenance.</p>
      </section>

      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => openTab(tab.key)}
              className={[
                "rounded-lg px-3 py-2 text-sm font-medium",
                activeTab === tab.key ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "vehicle" ? (
        <RegisterVehicle
          key={editingVehicle?.vehicle_id || "new-vehicle"}
          editingVehicle={editingVehicle}
          onCancelEdit={clearEdit}
          onSuccess={() => {
            clearEdit();
            loadData();
          }}
        />
      ) : null}
      {activeTab === "damage" ? (
        <RegisterVehicleDamage clients={clients} vehicles={vehicles} selectedVehicleId={selectedVehicleId} onSuccess={loadData} />
      ) : null}
      {activeTab === "maintenance" ? (
        <RegisterVehicleMaintenance vehicles={vehicles} selectedVehicleId={selectedVehicleId} onSuccess={loadData} />
      ) : null}

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading vehicles...</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.vehicle_id}
            vehicle={vehicle}
            actions={
              <>
                <button type="button" onClick={() => navigate(`/rents/register/${vehicle.vehicle_id}`)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Rent
                </button>
                <button type="button" onClick={() => startEdit(vehicle)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
                  Edit
                </button>
                <button type="button" onClick={() => openTab("damage", vehicle.vehicle_id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Damage
                </button>
                <button type="button" onClick={() => openTab("maintenance", vehicle.vehicle_id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Maintenance
                </button>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default VehiclePage;
