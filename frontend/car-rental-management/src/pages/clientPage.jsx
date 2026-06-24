import { useEffect, useMemo, useState } from "react";
import { getAllClients } from "../api/clientApi";
import Pagination from "../components/ui/Pagination";
import RegisterClient from "../components/ui/registerClient";

const pageSize = 8;

function ClientPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialClients = async () => {
      try {
        const data = await getAllClients();
        if (!ignore) setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadInitialClients();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredClients = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return clients;

    return clients.filter((client) =>
      [
        client.client_name,
        client.client_surname,
        client.personal_number,
        client.email,
        client.phone_number,
        client.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedClients = filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Clients</h2>
          <p className="text-sm text-slate-500">Register and search client data.</p>
        </div>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-80"
          placeholder="Search clients..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </section>

      <RegisterClient onSuccess={loadClients} />

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading clients...</p> : null}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Personal no.</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Nationality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClients.map((client) => (
                <tr key={client.client_id}>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {client.client_name} {client.client_surname}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{client.personal_number}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{client.email}</div>
                    <div>{client.phone_number}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{client.city}</td>
                  <td className="px-4 py-3 text-slate-600">{client.nationality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredClients.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-500">No clients found.</p>
        ) : null}
      </div>

      <Pagination page={currentPage} pageSize={pageSize} totalItems={filteredClients.length} onPageChange={setPage} />
    </div>
  );
}

export default ClientPage;
