import { useState } from "react";
import { registerVehicleDamage } from "../../api/vehicleDamageApi";

function RegisterVehicleDamage({ clients = [], vehicles = [], selectedVehicleId = "", onSuccess }) {
  const [formData, setFormData] = useState({
    client_id: "",
    vehicle_id: selectedVehicleId,
    damage: "",
    other_info: "",
    date_of_damage: new Date().toISOString().slice(0, 10),
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
      await registerVehicleDamage({
        ...formData,
        client_id: Number(formData.client_id),
        vehicle_id: Number(formData.vehicle_id),
      });
      setMessage("Damage registered.");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">Register damage</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="vehicle_id" value={formData.vehicle_id} onChange={updateField} required>
          <option value="">Vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
              {vehicle.brand} {vehicle.model} #{vehicle.vehicle_id}
            </option>
          ))}
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="client_id" value={formData.client_id} onChange={updateField} required>
          <option value="">Client</option>
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.client_name} {client.client_surname}
            </option>
          ))}
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="damage" placeholder="Damage" value={formData.damage} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="date_of_damage" type="date" value={formData.date_of_damage} onChange={updateField} required />
        <textarea className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" name="other_info" placeholder="Other info" rows="3" value={formData.other_info} onChange={updateField} />
      </div>
      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}
      <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Saving..." : "Register damage"}
      </button>
    </form>
  );
}

export default RegisterVehicleDamage;
