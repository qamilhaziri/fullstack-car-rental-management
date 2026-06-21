import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi.js";
import { useAuth } from "../hooks/useAuth.js";

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(formData);
      setUser(res.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[1fr_420px]">
        <section className="flex flex-col justify-between bg-slate-900 p-8 md:p-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-300">Car Rental Management</p>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
              Manage vehicles, clients, rents and payments from one place.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
              Simple dashboard for daily rental work: available cars, active rents, client records and vehicle costs.
            </p>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="font-semibold text-white">Vehicles</p>
              <p className="mt-1">Availability and pricing.</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="font-semibold text-white">Clients</p>
              <p className="mt-1">Fast search and register.</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="font-semibold text-white">Payments</p>
              <p className="mt-1">Track rent payments.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center bg-white p-6 text-slate-950 md:p-8">
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500">Use your admin account to continue.</p>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
