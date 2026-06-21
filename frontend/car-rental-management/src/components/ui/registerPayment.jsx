import { useState } from "react";
import { registerPayment } from "../../api/paymentApi";

function RegisterPayment({ rent, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    rent_id: rent?.rent_id || "",
    payment_amount: "",
    date_payment: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await registerPayment({
        rent_id: Number(formData.rent_id),
        payment_amount: Number(formData.payment_amount),
        date_payment: formData.date_payment,
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Register payment</h2>
        <p className="text-sm text-slate-500">Rent #{rent?.rent_id}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="payment_amount" type="number" step="0.01" placeholder="Payment amount" value={formData.payment_amount} onChange={updateField} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="date_payment" type="date" value={formData.date_payment} onChange={updateField} required />
      </div>

      {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving..." : "Save payment"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default RegisterPayment;
