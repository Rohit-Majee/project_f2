import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto transition-all duration-300">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
     
    </div>
  );
}
