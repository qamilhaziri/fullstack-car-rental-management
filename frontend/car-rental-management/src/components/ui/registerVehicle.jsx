import { useState } from "react";
import { registerVehicleCost, updateVehicleCost } from "../../api/vehicleCostApi";
import { registerVehicle, updateVehicle } from "../../api/vehicleApi";

const initialForm = {
  brand_id: "",
  model: "",
  vehicle_type: "",
  transmission: "",
  color: "",
  doors: "",
  production_year: "",
  fuel_type: "",
};

const initialCost = {
  cost_per_hour: "",
  cost_per_day: "",
};

const getCostIdFromResponse = (response) => {
  if (!response) return "";
  if (response.vcost_id) return response.vcost_id;
  if (response.cost_id) return response.cost_id;
  if (response.cost?.vcost_id) return response.cost.vcost_id;
  if (Array.isArray(response) && response[0]?.vcost_id) return response[0].vcost_id;
  return "";
};

function RegisterVehicle({ editingVehicle, onCancelEdit, onSuccess }) {
  const isEditing = Boolean(editingVehicle?.vehicle_id);
  const [formData, setFormData] = useState(() =>
    editingVehicle
      ? {
          brand_id: editingVehicle.brand_id || "",
          model: editingVehicle.model || "",
          vehicle_type: editingVehicle.vehicle_type || "",
          transmission: editingVehicle.transmission || "",
          color: editingVehicle.color || "",
          doors: editingVehicle.doors || "",
          production_year: editingVehicle.production_year || "",
          fuel_type: editingVehicle.fuel_type || "",
        }
      : initialForm
  );
  const [costData, setCostData] = useState(() =>
    editingVehicle
      ? {
          cost_per_hour: editingVehicle.cost_per_hour || "",
          cost_per_day: editingVehicle.cost_per_day || "",
        }
      : initialCost
  );
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const updateCostField = (event) => {
    setCostData({ ...costData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const costPayload = {
        cost_per_hour: Number(costData.cost_per_hour),
        cost_per_day: Number(costData.cost_per_day),
      };

      if (isEditing) {
        await updateVehicle(editingVehicle.vehicle_id, {
          ...formData,
          brand_id: Number(formData.brand_id),
          doors: Number(formData.doors),
          production_year: Number(formData.production_year),
        });

        await updateVehicleCost(editingVehicle.cost_id, costPayload);
        setMessage("Vehicle updated.");
      } else {
        const costResponse = await registerVehicleCost(costPayload);
        const costId = getCostIdFromResponse(costResponse);

        if (!costId) {
          throw new Error("Vehicle cost was created, but backend did not return the cost id.");
        }

        const payload = new FormData();
        Object.entries({ ...formData, cost_id: costId }).forEach(([key, value]) => payload.append(key, value));
        if (image) payload.append("image", image);

        await registerVehicle(payload);
        setFormData(initialForm);
        setCostData(initialCost);
        setImage(null);
        event.target.reset();
        setMessage("Vehicle registered.");
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">{isEditing ? "Edit vehicle" : "Register vehicle"}</h2>
        <p className="text-sm text-slate-500">
          {isEditing ? "Update vehicle details and pricing." : "Create pricing and vehicle details together."}
        </p>
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
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="cost_per_hour" type="number" step="0.01" placeholder="Cost per hour" value={costData.cost_per_hour} onChange={updateCostField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="cost_per_day" type="number" step="0.01" placeholder="Cost per day" value={costData.cost_per_day} onChange={updateCostField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="doors" type="number" placeholder="Doors" value={formData.doors} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="production_year" type="number" placeholder="Production year" value={formData.production_year} onChange={updateField} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="fuel_type" value={formData.fuel_type} onChange={updateField} required>
          <option value="">Fuel type</option>
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>
        {!isEditing ? (
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-3" type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
        ) : null}
      </div>

      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving..." : isEditing ? "Save changes" : "Register vehicle"}
        </button>
        {isEditing ? (
          <button type="button" onClick={onCancelEdit} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default RegisterVehicle;
