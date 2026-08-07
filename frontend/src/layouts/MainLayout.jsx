import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen bg-slate-100">

        <Navbar />

        <main className="p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}