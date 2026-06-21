import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
