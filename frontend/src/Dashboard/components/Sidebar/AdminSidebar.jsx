import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaUtensils, FaCalendarAlt, FaShoppingCart, FaUserCheck, FaUser, FaSignOutAlt, FaTable } from "react-icons/fa";

const AdminSidebar = ({ collapsed }) => {
  return (
    <aside 
      className={`backdrop-blur-md bg-white/20 text-white h-screen ${collapsed ? 'w-16' : 'w-64'} flex flex-col border-r border-white/20 shadow-lg transition-all duration-300 fixed top-0 left-0 z-50`}
    >
      {/* Sidebar Header */}
      <div className="p-4 text-2xl font-bold border-b border-white/20 flex items-center justify-center">
        {collapsed ? (
          <span>BW</span>
        ) : (
          <span>The BrewMaster</span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-4">
            <Link
              to="/admin"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaHome size={20} />
              {!collapsed && <span className="ml-3">Home</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/employees"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaUsers size={20} />
              {!collapsed && <span className="ml-3">Employees</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/menu"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaUtensils size={20} />
              {!collapsed && <span className="ml-3">Menu</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/reservations"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaCalendarAlt size={20} />
              {!collapsed && <span className="ml-3">Reservations</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/orders"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaShoppingCart size={20} />
              {!collapsed && <span className="ml-3">Orders</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/customers"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaUserCheck size={20} />
              {!collapsed && <span className="ml-3">Customers</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/profile"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaUser size={20} />
              {!collapsed && <span className="ml-3">Profile</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin/tables"
              className={`flex items-center p-2 rounded hover:bg-white/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <FaTable size={20} />
              {!collapsed && <span className="ml-3">Table</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={`p-4 border-t border-white/20 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => {
            // Add your logout logic here
          }}
          className={`p-2 bg-red-600/80 hover:bg-red-700/90 rounded transition-colors backdrop-blur-sm ${collapsed ? 'w-10 h-10 flex items-center justify-center' : 'w-full'}`}
        >
          {collapsed ? (
            <FaSignOutAlt size={20} />
          ) : (
            <div className="flex items-center justify-center">
              <FaSignOutAlt size={20} />
              <span className="ml-2">Logout</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;