function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-800">Car Rental Management</p>
          <p>Vehicles, clients, rents and payments.</p>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Admin workspace
        </p>
      </div>
    </footer>
  );
}

export default Footer;
