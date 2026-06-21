import { useState } from "react";
import { registerVehicle } from "../../api/vehicleApi";

const initialForm = {
  brand_id: "",
  model: "",
  vehicle_type: "",
  transmission: "",
  color: "",
  cost_id: "",
  doors: "",
  production_year: "",
  fuel_type: "",
};

function RegisterVehicle({ onSuccess }) {
  const [formData, setFormData] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append("image", image);

    try {
      await registerVehicle(payload);
      setFormData(initialForm);
      setImage(null);
      event.target.reset();
      setMessage("Vehicle registered.");
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
        <h2 className="text-lg font-semibold text-slate-950">Register vehicle</h2>
        <p className="text-sm text-slate-500">Use brand and cost ids from your database.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="brand_id" type="number" placeholder="Brand ID" value={formData.brand_id} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="model" placeholder="Model" value={formData.model} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="vehicle_type" placeholder="Vehicle type" value={formData.vehicle_type} onChange={updateField} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="transmission" value={formData.transmission} onChange={updateField} required>
          <option value="">Transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="color" placeholder="Color" value={formData.color} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="cost_id" type="number" placeholder="Cost ID" value={formData.cost_id} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="doors" type="number" placeholder="Doors" value={formData.doors} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="production_year" type="number" placeholder="Production year" value={formData.production_year} onChange={updateField} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="fuel_type" value={formData.fuel_type} onChange={updateField} required>
          <option value="">Fuel type</option>
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-3" type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
      </div>

      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Saving..." : "Register vehicle"}
      </button>
    </form>
  );
}

export default RegisterVehicle;
