import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/employee`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setEmployees(response.data.data.employees);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  // Handle delete confirmation
  const confirmDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  // Handle actual delete
  const handleDelete = async () => {
    await axios.delete(
      `${import.meta.env.VITE_APP_BASE_URL}/employee/${employeeToDelete._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Update local state
    setEmployees(employees.filter((emp) => emp._id !== employeeToDelete._id));
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm);

    const matchesRole = filterRole ? employee.role === filterRole : true;
    const matchesStatus = filterStatus
      ? employee.status === filterStatus
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Link
          to="/admin/employees/add"
          className="flex items-center px-4 py-2 bg-green-600/80 hover:bg-green-700/90 rounded transition-colors backdrop-blur-sm"
        >
          <FaPlus className="mr-2" />
          Add New Employee
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 bg-white/10 border border-white/20 rounded"
          />
          <FaSearch className="absolute left-3 top-3" />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center">
            <FaFilter className="mr-2" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-2 bg-white/10 border border-white/20 rounded"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
              <option value="cashier">Cashier</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-white/10 border border-white/20 rounded"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2">Loading employees...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded">
          <p>No employees found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Shift</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-700">
                        {employee.profileImage ? (
                          <img
                            src={`${
                              import.meta.env.VITE_IMAGE_BASE_URL
                            }/employee/${employee.profileImage}`}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          employee.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-300">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{employee.role}</td>
                  <td className="p-3 capitalize">{employee.shift}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        employee.status === "active"
                          ? "bg-green-500/30"
                          : employee.status === "inactive"
                          ? "bg-yellow-500/30"
                          : "bg-red-500/30"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(employee.dateOfJoining)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/employees/view/${employee._id}`}
                        className="p-2 bg-blue-600/50 rounded hover:bg-blue-700/60"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/employees/edit/${employee._id}`}
                        className="p-2 bg-yellow-600/50 rounded hover:bg-yellow-700/60"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => confirmDelete(employee)}
                        className="p-2 bg-red-600/50 rounded hover:bg-red-700/60"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-white/20 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete employee{" "}
              <span className="font-bold">{employeeToDelete?.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
