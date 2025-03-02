import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    salary: "",
    shift: "",
    status: "active",
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    },
    profileImage: null,
  });

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/employee/${id}`
        );
        const employee = response.data.data;
        setFormData({
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          salary: employee.salary,
          shift: employee.shift,
          status: employee.status,
          // If your backend returns an address, you can set it here:
          address: employee.address || {
            street: "",
            city: "",
            state: "",
            pinCode: "",
            country: "",
          },
          profileImage: employee.profileImage,
        });
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  // Handle changes for main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes for address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: e.target.files[0],
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/employee/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/admin/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p className="mt-2">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaEdit /> Update Employee
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          />
        </div>
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block">
            Phone:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          />
        </div>
        {/* Role */}
        <div>
          <label htmlFor="role" className="block">
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="chef">Chef</option>
            <option value="waiter">Waiter</option>
            <option value="cashier">Cashier</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
        {/* Salary */}
        <div>
          <label htmlFor="salary" className="block">
            Salary:
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          />
        </div>
        {/* Shift */}
        <div>
          <label htmlFor="shift" className="block">
            Shift:
          </label>
          <select
            id="shift"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          >
            <option value="">Select Shift</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>
        {/* Status */}
        <div>
          <label htmlFor="status" className="block">
            Status:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        {/* Profile Image */}
        <div>
          <label htmlFor="profileImage" className="block">
            Profile Image:
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 bg-white/10 border border-white/20 rounded"
          />
        </div>
        {/* Address Fieldset */}
        <fieldset className="border border-white/20 p-4 rounded">
          <legend className="text-lg font-bold mb-2">Address</legend>
          {/* Street */}
          <div>
            <label htmlFor="street" className="block">
              Street:
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded"
            />
          </div>
          {/* City */}
          <div>
            <label htmlFor="city" className="block">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded"
            />
          </div>
          {/* State */}
          <div>
            <label htmlFor="state" className="block">
              State:
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.address.state}
              onChange={handleAddressChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded"
            />
          </div>
          {/* Pin Code */}
          <div>
            <label htmlFor="pinCode" className="block">
              Pin Code:
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={formData.address.pinCode}
              onChange={handleAddressChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded"
            />
          </div>
          {/* Country */}
          <div>
            <label htmlFor="country" className="block">
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.address.country}
              onChange={handleAddressChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded"
            />
          </div>
        </fieldset>
        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployee;
