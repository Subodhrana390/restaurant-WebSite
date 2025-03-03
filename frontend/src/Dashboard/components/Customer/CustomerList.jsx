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

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/user`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsers(response.data.data.users);
      } catch (error) {
     
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    await axios.delete(
      `${import.meta.env.VITE_APP_BASE_URL}/users/${userToDelete._id}`
    );
    setUsers(users.filter((u) => u._id !== userToDelete._id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesStatus = filterStatus
      ? user.isActive.toString() === filterStatus
      : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link
          to="/admin/customers/add"
          className="flex items-center px-4 py-2 bg-green-600/80 hover:bg-green-700/90 rounded transition-colors"
        >
          <FaPlus className="mr-2" /> Add New User
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 bg-white/10 border border-white/20 rounded"
          />
          <FaSearch className="absolute left-3 top-3" />
        </div>

        <div className="flex gap-4">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 bg-white/10 border border-white/20 rounded"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-white/10 border border-white/20 rounded"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  <span
                    className={
                      user.isActive ? "text-green-400" : "text-red-400"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/customers/view/${user._id}`}
                      className="p-2 bg-blue-600/50 rounded hover:bg-blue-700/60"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      to={`/admin/customers/edit/${user._id}`}
                      className="p-2 bg-yellow-600/50 rounded hover:bg-yellow-700/60"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => confirmDelete(user)}
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
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-white/20">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete user{" "}
              <span className="font-bold">{userToDelete?.name}</span>?
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

export default CustomerList;
