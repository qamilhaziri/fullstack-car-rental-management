import { useState } from "react";
import { registerVehicleMaintenance } from "../../api/vehicleMaintenanceApi";

function RegisterVehicleMaintenance({ vehicles = [], selectedVehicleId = "", onSuccess }) {
  const [vehicleId, setVehicleId] = useState(selectedVehicleId);
  const [formData, setFormData] = useState({
    service_type: "",
    other_info: "",
    service_date: new Date().toISOString().slice(0, 10),
    service_cost: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await registerVehicleMaintenance(vehicleId, {
        ...formData,
        service_cost: formData.service_cost ? Number(formData.service_cost) : null,
      });
      setMessage("Maintenance registered.");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">Register maintenance</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} required>
          <option value="">Vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
              {vehicle.brand} {vehicle.model} #{vehicle.vehicle_id}
            </option>
          ))}
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="service_type" placeholder="Maintenance type" value={formData.service_type} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="service_date" type="date" value={formData.service_date} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="service_cost" type="number" step="0.01" placeholder="Cost" value={formData.service_cost} onChange={updateField} />
        <textarea className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" name="other_info" placeholder="Description" rows="3" value={formData.other_info} onChange={updateField} />
      </div>
      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}
      <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Saving..." : "Register maintenance"}
      </button>
    </form>
  );
}

export default RegisterVehicleMaintenance;
