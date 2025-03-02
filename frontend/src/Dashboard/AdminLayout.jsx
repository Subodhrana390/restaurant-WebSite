import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/Sidebar/AdminSidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Sidebar - conditionally apply classes based on collapsed state */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <AdminSidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="mb-4 p-2 bg-white/10 backdrop-blur-sm rounded hover:bg-white/20 transition-colors text-white"
        >
          {sidebarCollapsed ? (
            <FaArrowRight size={16} />
          ) : (
            <FaArrowLeft size={16} />
          )}
        </button>

        {/* Content Container with Glass Effect */}
        <div className="rounded-lg backdrop-blur-md bg-white/10 border border-white/20 shadow-xl p-6 min-h-[calc(100vh-120px)]">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
