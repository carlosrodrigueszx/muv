import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DriverLayout() {
  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar />
      <main className="p-[24px] flex flex-col gap-[24px]">
        <Outlet /> {/* As páginas filhas entram aqui automaticamente */}
      </main>
    </div>
  );
}
