import { vehicleImageUrl } from "../../api/vehicleApi";

function VehicleCard({ vehicle, actions }) {
  const title = `${vehicle.brand || "Vehicle"} ${vehicle.model || ""}`.trim();

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="aspect-video bg-slate-100">
        {vehicle.file_name ? (
          <img
            src={vehicleImageUrl(vehicle.file_name)}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h3 className="font-semibold text-slate-950">{title}</h3>
          <p className="text-sm text-slate-500">
            {vehicle.vehicle_type || "Type"} · {vehicle.transmission || "Transmission"} ·{" "}
            {vehicle.fuel_type || "Fuel"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Color</p>
            <p className="font-medium text-slate-800">{vehicle.color || "-"}</p>
          </div>
          <div>
            <p className="text-slate-500">Year</p>
            <p className="font-medium text-slate-800">{vehicle.production_year || "-"}</p>
          </div>
          <div>
            <p className="text-slate-500">Per hour</p>
            <p className="font-medium text-slate-800">{vehicle.cost_per_hour ?? "-"} EUR</p>
          </div>
          <div>
            <p className="text-slate-500">Per day</p>
            <p className="font-medium text-slate-800">{vehicle.cost_per_day ?? "-"} EUR</p>
          </div>
        </div>

        {actions ? <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">{actions}</div> : null}
      </div>
    </article>
  );
}

export default VehicleCard;
