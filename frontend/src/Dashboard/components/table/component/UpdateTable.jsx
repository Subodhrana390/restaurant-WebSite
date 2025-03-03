import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const UpdateTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tableNumber: 1,
    capacity: 1,
  });
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/tables/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFormData(response.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  // Handle text and select field changes (for main form fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/tables/${formData.tableNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {}
    navigate("/admin/tables");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="bg-inherit p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <FaEdit /> Update Table
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="tableNumber"
              className="block text-sm font-medium text-gray-300"
            >
              Table Number:
            </label>
            <input
              type="number"
              id="tableNumber"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              min={1}
              max={15}
              placeholder="John Doe"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-300"
            >
              Capacity :
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min={1}
              max={4}
              placeholder="1"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white transition duration-200"
          >
            Update Table
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTable;
