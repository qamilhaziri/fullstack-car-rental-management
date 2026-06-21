import { useState } from "react";
import { registerClient } from "../../api/clientApi";

const initialForm = {
  client_name: "",
  client_surname: "",
  personal_number: "",
  gender: "",
  city: "",
  email: "",
  date_of_birth: "",
  phone_number: "",
  nationality: "",
};

function RegisterClient({ onSuccess }) {
  const [formData, setFormData] = useState(initialForm);
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

    try {
      await registerClient(formData);
      setFormData(initialForm);
      setMessage("Client registered.");
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
        <h2 className="text-lg font-semibold text-slate-950">Register client</h2>
        <p className="text-sm text-slate-500">Add a client before creating a rent.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="client_name" placeholder="Name" value={formData.client_name} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="client_surname" placeholder="Surname" value={formData.client_surname} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="personal_number" placeholder="Personal number" value={formData.personal_number} onChange={updateField} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="gender" value={formData.gender} onChange={updateField} required>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="city" placeholder="City" value={formData.city} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="email" type="email" placeholder="Email" value={formData.email} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="phone_number" placeholder="Phone number" value={formData.phone_number} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={updateField} required />
      </div>

      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Saving..." : "Register client"}
      </button>
    </form>
  );
}

export default RegisterClient;
