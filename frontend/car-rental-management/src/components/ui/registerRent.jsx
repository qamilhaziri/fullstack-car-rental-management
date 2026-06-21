import { useState } from "react";
import { registerRent } from "../../api/rentApi";

function RegisterRent({ clients = [], vehicles = [], selectedVehicleId = "", onSuccess }) {
  const [formData, setFormData] = useState({
    vId: selectedVehicleId,
    cId: "",
    date_rented: new Date().toISOString().slice(0, 10),
    date_to_return: "",
    date_returned: "",
    is_returned: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...formData,
      vId: Number(formData.vId),
      cId: Number(formData.cId),
      date_returned: formData.date_returned || null,
    };

    try {
      await registerRent(payload);
      setMessage("Rent registered.");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Register rent</h2>
        <p className="text-sm text-slate-500">Choose a client and an available vehicle.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="vId" value={formData.vId} onChange={updateField} required>
          <option value="">Vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
              {vehicle.brand} {vehicle.model} #{vehicle.vehicle_id}
            </option>
          ))}
        </select>

        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="cId" value={formData.cId} onChange={updateField} required>
          <option value="">Client</option>
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.client_name} {client.client_surname} #{client.client_id}
            </option>
          ))}
        </select>

        <label className="text-sm text-slate-600">
          Date rented
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" name="date_rented" type="date" value={formData.date_rented} onChange={updateField} required />
        </label>

        <label className="text-sm text-slate-600">
          Date to return
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" name="date_to_return" type="date" value={formData.date_to_return} onChange={updateField} required />
        </label>
      </div>

      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Saving..." : "Register rent"}
      </button>
    </form>
  );
}

export default RegisterRent;
