import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllClients } from "../api/clientApi";
import { getPaymentByRentId } from "../api/paymentApi";
import { getRentsByVehicleId, updateRent } from "../api/rentApi";
import { getAllVehicles, getAllVehiclesAvailable } from "../api/vehicleApi";
import RegisterPayment from "../components/ui/registerPayment";
import RegisterRent from "../components/ui/registerRent";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

function RentPage() {
  const { vehicleId } = useParams();
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [rents, setRents] = useState([]);
  const [paymentsByRent, setPaymentsByRent] = useState({});
  const [paymentRent, setPaymentRent] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [clientData, vehicleData, availableData] = await Promise.all([
        getAllClients(),
        getAllVehicles(),
        getAllVehiclesAvailable(),
      ]);

      const allVehicles = Array.isArray(vehicleData) ? vehicleData : [];
      const rentGroups = await Promise.all(
        allVehicles.map(async (vehicle) => {
          try {
            const vehicleRents = await getRentsByVehicleId(vehicle.vehicle_id);
            return Array.isArray(vehicleRents) ? vehicleRents : [];
          } catch {
            return [];
          }
        })
      );

      const allRents = rentGroups.flat();
      const paymentEntries = await Promise.all(
        allRents.map(async (rent) => {
          try {
            const paymentData = await getPaymentByRentId(rent.rent_id);
            return [rent.rent_id, Array.isArray(paymentData) ? paymentData : []];
          } catch {
            return [rent.rent_id, []];
          }
        })
      );

      setClients(Array.isArray(clientData) ? clientData : []);
      setVehicles(allVehicles);
      setAvailableVehicles(Array.isArray(availableData) ? availableData : []);
      setRents(allRents);
      setPaymentsByRent(Object.fromEntries(paymentEntries));
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
        const [clientData, vehicleData, availableData] = await Promise.all([
          getAllClients(),
          getAllVehicles(),
          getAllVehiclesAvailable(),
        ]);

        const allVehicles = Array.isArray(vehicleData) ? vehicleData : [];
        const rentGroups = await Promise.all(
          allVehicles.map(async (vehicle) => {
            try {
              const vehicleRents = await getRentsByVehicleId(vehicle.vehicle_id);
              return Array.isArray(vehicleRents) ? vehicleRents : [];
            } catch {
              return [];
            }
          })
        );

        const allRents = rentGroups.flat();
        const paymentEntries = await Promise.all(
          allRents.map(async (rent) => {
            try {
              const paymentData = await getPaymentByRentId(rent.rent_id);
              return [rent.rent_id, Array.isArray(paymentData) ? paymentData : []];
            } catch {
              return [rent.rent_id, []];
            }
          })
        );

        if (!ignore) {
          setClients(Array.isArray(clientData) ? clientData : []);
          setVehicles(allVehicles);
          setAvailableVehicles(Array.isArray(availableData) ? availableData : []);
          setRents(allRents);
          setPaymentsByRent(Object.fromEntries(paymentEntries));
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

  const clientMap = useMemo(() => {
    return clients.reduce((map, client) => {
      map[client.client_id] = client;
      return map;
    }, {});
  }, [clients]);

  const vehicleMap = useMemo(() => {
    return vehicles.reduce((map, vehicle) => {
      map[vehicle.vehicle_id] = vehicle;
      return map;
    }, {});
  }, [vehicles]);

  const filteredRents = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return rents;

    return rents.filter((rent) => {
      const client = clientMap[rent.client_id];
      const vehicle = vehicleMap[rent.vehicle_id] || rent;
      return [client?.client_name, client?.client_surname, vehicle?.brand, vehicle?.model, rent.rent_id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [clientMap, rents, search, vehicleMap]);

  const markReturned = async (rent) => {
    try {
      await updateRent(rent.rent_id, {
        is_returned: true,
        date_returned: new Date().toISOString().slice(0, 10),
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Rents</h2>
          <p className="text-sm text-slate-500">Register rents and review active or returned vehicles.</p>
        </div>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-80"
          placeholder="Search rents..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <RegisterRent
        clients={clients}
        vehicles={availableVehicles}
        selectedVehicleId={vehicleId || ""}
        onSuccess={() => {
          setPaymentRent(null);
          loadData();
        }}
      />

      {paymentRent ? (
        <RegisterPayment
          rent={paymentRent}
          onCancel={() => setPaymentRent(null)}
          onSuccess={() => {
            setPaymentRent(null);
            loadData();
          }}
        />
      ) : null}

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading rents...</p> : null}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Rented</th>
                <th className="px-4 py-3 font-medium">Return due</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRents.map((rent) => {
                const client = clientMap[rent.client_id];
                const vehicle = vehicleMap[rent.vehicle_id] || rent;
                const payments = paymentsByRent[rent.rent_id] || [];
                const paidAmount = payments.reduce((total, payment) => total + Number(payment.payment_amount || 0), 0);
                return (
                  <tr key={rent.rent_id}>
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {vehicle.brand} {vehicle.model}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {client ? `${client.client_name} ${client.client_surname}` : `Client #${rent.client_id}`}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(rent.date_rented)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(rent.date_to_return)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{paidAmount.toFixed(2)} EUR</td>
                    <td className="px-4 py-3">
                      <span className={rent.is_returned ? "rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600" : "rounded-full bg-green-50 px-2 py-1 text-xs text-green-700"}>
                        {rent.is_returned ? "Returned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setPaymentRent(rent)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100">
                          Payment
                        </button>
                        {!rent.is_returned ? (
                          <button type="button" onClick={() => markReturned(rent)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                            Mark returned
                          </button>
                        ) : (
                          <span className="py-2 text-xs text-slate-400">{formatDate(rent.date_returned)}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && filteredRents.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-500">No rents found.</p>
        ) : null}
      </div>
    </div>
  );
}

export default RentPage;
