import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "../api/brandApi";
import { getAllClients } from "../api/clientApi";
import { getDamageByVehicleId } from "../api/vehicleDamageApi";
import { getAllMaintenanceByVehicleId } from "../api/vehicleMaintenanceApi";
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
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState("vehicle");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [infoVehicle, setInfoVehicle] = useState(null);
  const [damageRecords, setDamageRecords] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [infoLoading, setInfoLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [vehicleData, clientData, brandData] = await Promise.all([getAllVehicles(), getAllClients(), getAllBrands()]);
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      setClients(Array.isArray(clientData) ? clientData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
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
        const [vehicleData, clientData, brandData] = await Promise.all([getAllVehicles(), getAllClients(), getAllBrands()]);
        if (!ignore) {
          setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
          setClients(Array.isArray(clientData) ? clientData : []);
          setBrands(Array.isArray(brandData) ? brandData : []);
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

  const showVehicleInfo = async (vehicle) => {
    setInfoVehicle(vehicle);
    setInfoLoading(true);
    setError("");
    try {
      const [damages, maintenances] = await Promise.all([
        getDamageByVehicleId(vehicle.vehicle_id),
        getAllMaintenanceByVehicleId(vehicle.vehicle_id),
      ]);
      setDamageRecords(Array.isArray(damages) ? damages : []);
      setMaintenanceRecords(Array.isArray(maintenances) ? maintenances : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setInfoLoading(false);
    }
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
          brands={brands}
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

      {infoVehicle ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {infoVehicle.brand} {infoVehicle.model} info
              </h3>
              <p className="text-sm text-slate-500">Damage and maintenance records for this vehicle.</p>
            </div>
            <button type="button" onClick={() => setInfoVehicle(null)} className="w-fit rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Close
            </button>
          </div>

          {infoLoading ? <p className="text-sm text-slate-500">Loading records...</p> : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h4 className="font-medium text-slate-900">Damage</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {damageRecords.map((damage, index) => (
                  <div key={`${damage.date_of_damage}-${index}`} className="p-4 text-sm">
                    <p className="font-medium text-slate-950">{damage.damage}</p>
                    <p className="mt-1 text-slate-600">{damage.other_info || "No extra info"}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Client: {[damage.client_name, damage.client_surname].filter(Boolean).join(" ") || "-"} · Date: {damage.date_of_damage ? new Date(damage.date_of_damage).toLocaleDateString() : "-"}
                    </p>
                  </div>
                ))}
                {!infoLoading && damageRecords.length === 0 ? <p className="p-4 text-sm text-slate-500">No damage records.</p> : null}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h4 className="font-medium text-slate-900">Maintenance</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {maintenanceRecords.map((maintenance, index) => (
                  <div key={maintenance.vmaintenance_id || index} className="p-4 text-sm">
                    <p className="font-medium text-slate-950">{maintenance.maintenance_type || maintenance.type || "Maintenance"}</p>
                    <p className="mt-1 text-slate-600">{maintenance.description || maintenance.other_info || "No description"}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Date: {maintenance.maintenance_date ? new Date(maintenance.maintenance_date).toLocaleDateString() : "-"}
                      {maintenance.cost ? ` · Cost: ${maintenance.cost} EUR` : ""}
                    </p>
                  </div>
                ))}
                {!infoLoading && maintenanceRecords.length === 0 ? <p className="p-4 text-sm text-slate-500">No maintenance records.</p> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
                <button type="button" onClick={() => showVehicleInfo(vehicle)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100">
                  Info
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
